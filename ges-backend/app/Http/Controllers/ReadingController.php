<?php

namespace App\Http\Controllers;

use App\Models\MonthlyReading;
use App\Models\DepartmentReading;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ReadingController extends Controller
{
    /**
     * Guardar lectura completa (lecturas + departamentos)
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'reading_date' => 'required|date',
            'lectura1' => 'required|numeric|min:0',
            'lectura2' => 'required|numeric|min:0',
            'periodo' => 'required|string|max:50',
            'departments' => 'required|array|min:1',
            'departments.*.department' => 'required|string',
            'departments.*.current_reading' => 'required|numeric|min:0',
            'departments.*.previous_reading' => 'nullable|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Crear lectura mensual
            $monthlyReading = MonthlyReading::create([
                'reading_date' => $request->reading_date,
                'lectura1' => $request->lectura1,
                'lectura2' => $request->lectura2,
                'total_reading' => $request->lectura1 + $request->lectura2,
                'periodo' => $request->periodo
            ]);

            // Calcular totales para precio unitario
            $totalConsumption = 0;
            foreach ($request->departments as $dept) {
                $current = $dept['current_reading'];
                $previous = $dept['previous_reading'] ?? 0;
                $consumption = $current - $previous;
                $totalConsumption += $consumption;
            }

            $unitPrice = $totalConsumption > 0 
                ? round($monthlyReading->total_reading / $totalConsumption, 2) 
                : 0;

            // Crear lecturas de departamentos
            foreach ($request->departments as $dept) {
                $current = $dept['current_reading'];
                $previous = $dept['previous_reading'] ?? 0;
                $consumption = $current - $previous;
                $totalBs = $consumption * $unitPrice;
                $totalBsRounded = round($totalBs);

                DepartmentReading::create([
                    'monthly_reading_id' => $monthlyReading->id,
                    'department' => $dept['department'],
                    'current_reading' => $current,
                    'previous_reading' => $previous,
                    'consumption' => $consumption,
                    'unit_price' => $unitPrice,
                    'total_bs' => $totalBs,
                    'total_bs_rounded' => $totalBsRounded
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Lectura guardada exitosamente',
                'data' => $monthlyReading->load('departmentReadings')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al guardar la lectura',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener todas las lecturas mensuales
     */
    public function index()
    {
        $readings = MonthlyReading::with('departmentReadings')
            ->orderBy('reading_date', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $readings
        ]);
    }

    /**
     * Obtener una lectura específica por ID
     */
    public function show($id)
    {
        $reading = MonthlyReading::with('departmentReadings')->find($id);

        if (!$reading) {
            return response()->json([
                'success' => false,
                'message' => 'Lectura no encontrada'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $reading
        ]);
    }

    /**
     * Obtener lectura por periodo
     */
    public function getByPeriodo($periodo)
    {
        $reading = MonthlyReading::with('departmentReadings')
            ->where('periodo', $periodo)
            ->first();

        if (!$reading) {
            return response()->json([
                'success' => false,
                'message' => 'No se encontró lectura para el periodo especificado'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $reading
        ]);
    }

    /**
     * Actualizar lectura mensual
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'reading_date' => 'required|date',
            'lectura1' => 'required|numeric|min:0',
            'lectura2' => 'required|numeric|min:0',
            'periodo' => 'required|string|max:50',
            'departments' => 'required|array|min:1',
            'departments.*.department' => 'required|string',
            'departments.*.current_reading' => 'required|numeric|min:0',
            'departments.*.previous_reading' => 'nullable|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            $monthlyReading = MonthlyReading::find($id);
            
            if (!$monthlyReading) {
                return response()->json([
                    'success' => false,
                    'message' => 'Lectura no encontrada'
                ], 404);
            }

            // Actualizar lectura mensual
            $monthlyReading->update([
                'reading_date' => $request->reading_date,
                'lectura1' => $request->lectura1,
                'lectura2' => $request->lectura2,
                'total_reading' => $request->lectura1 + $request->lectura2,
                'periodo' => $request->periodo
            ]);

            // Eliminar lecturas de departamentos anteriores
            $monthlyReading->departmentReadings()->delete();

            // Recalcular y crear nuevas lecturas
            $totalConsumption = 0;
            foreach ($request->departments as $dept) {
                $current = $dept['current_reading'];
                $previous = $dept['previous_reading'] ?? 0;
                $consumption = $current - $previous;
                $totalConsumption += $consumption;
            }

            $unitPrice = $totalConsumption > 0 
                ? round($monthlyReading->total_reading / $totalConsumption, 2) 
                : 0;

            foreach ($request->departments as $dept) {
                $current = $dept['current_reading'];
                $previous = $dept['previous_reading'] ?? 0;
                $consumption = $current - $previous;
                $totalBs = $consumption * $unitPrice;
                $totalBsRounded = round($totalBs);

                DepartmentReading::create([
                    'monthly_reading_id' => $monthlyReading->id,
                    'department' => $dept['department'],
                    'current_reading' => $current,
                    'previous_reading' => $previous,
                    'consumption' => $consumption,
                    'unit_price' => $unitPrice,
                    'total_bs' => $totalBs,
                    'total_bs_rounded' => $totalBsRounded
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Lectura actualizada exitosamente',
                'data' => $monthlyReading->load('departmentReadings')
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar la lectura',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Eliminar lectura
     */
    public function destroy($id)
    {
        try {
            $monthlyReading = MonthlyReading::find($id);

            if (!$monthlyReading) {
                return response()->json([
                    'success' => false,
                    'message' => 'Lectura no encontrada'
                ], 404);
            }

            $monthlyReading->delete();

            return response()->json([
                'success' => true,
                'message' => 'Lectura eliminada exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar la lectura',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener lectura anterior de un departamento
     */
    public function getPreviousReading($department)
    {
        $lastReading = DepartmentReading::where('department', $department)
            ->orderBy('created_at', 'desc')
            ->first();

        if (!$lastReading) {
            return response()->json([
                'success' => false,
                'message' => 'No hay lectura anterior para este departamento'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'department' => $department,
                'previous_reading' => $lastReading->current_reading
            ]
        ]);
    }
}