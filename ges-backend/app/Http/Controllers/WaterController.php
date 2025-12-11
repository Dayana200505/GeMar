<?php

namespace App\Http\Controllers;

use App\Models\WaterReading;
use App\Models\Payment;
use App\Models\Expense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class WaterController extends Controller
{
    // Obtener todas las lecturas
    public function index()
    {
        $readings = WaterReading::with('department')
            ->orderBy('reading_date', 'desc')
            ->get()
            ->groupBy(function($item) {
                return Carbon::parse($item->reading_date)->format('Y-m');
            });
        
        return response()->json($readings);
    }

    // Obtener lectura por mes y año
    public function getByMonthYear($month, $year)
    {
        $readings = WaterReading::with('department')
            ->whereMonth('reading_date', $month)
            ->whereYear('reading_date', $year)
            ->orderBy('department_id')
            ->get();
        
        $general = $readings->firstWhere('department.code', 'GENERAL');
        $departments = $readings->where('department.code', '!=', 'GENERAL');
        
        return response()->json([
            'general' => $general,
            'departments' => $departments,
            'total_consumption' => $departments->sum('consumption'),
            'total_amount' => $departments->sum('total_amount'),
            'price_per_cube' => $general ? $general->price_per_cube : 0
        ]);
    }

    // Crear nuevas lecturas
    public function store(Request $request)
    {
        $request->validate([
            'reading_date' => 'required|date',
            'semapa_readings' => 'required|array|min:2',
            'readings' => 'required|array'
        ]);

        // Verificar si ya existe registro para este mes
        $existing = WaterReading::whereMonth('reading_date', Carbon::parse($request->reading_date)->month)
            ->whereYear('reading_date', Carbon::parse($request->reading_date)->year)
            ->exists();
        
        if ($existing) {
            return response()->json(['error' => 'Ya existe un registro para este mes'], 409);
        }

        DB::beginTransaction();
        try {
            // Calcular total de lecturas SEMAPA
            $semapaTotal = array_sum($request->semapa_readings);
            
            // Obtener lecturas del mes anterior para usar como "anterior"
            $prevMonth = Carbon::parse($request->reading_date)->subMonth();
            $previousReadings = WaterReading::whereMonth('reading_date', $prevMonth->month)
                ->whereYear('reading_date', $prevMonth->year)
                ->get()
                ->keyBy('department_id');
            
            // Calcular consumo total de departamentos
            $totalConsumption = 0;
            foreach ($request->readings as $reading) {
                $current = $reading['current_reading'];
                $previous = isset($previousReadings[$reading['department_id']]) 
                    ? $previousReadings[$reading['department_id']]->current_reading 
                    : 0;
                $consumption = $current - $previous;
                $totalConsumption += $consumption;
            }
            
            // Calcular precio por cubo
            $pricePerCube = $totalConsumption > 0 ? $semapaTotal / $totalConsumption : 0;
            
            // Guardar lecturas
            foreach ($request->readings as $reading) {
                $current = $reading['current_reading'];
                $previous = isset($previousReadings[$reading['department_id']]) 
                    ? $previousReadings[$reading['department_id']]->current_reading 
                    : 0;
                $consumption = $current - $previous;
                $total = $consumption * $pricePerCube;
                
                WaterReading::create([
                    'department_id' => $reading['department_id'],
                    'reading_date' => $request->reading_date,
                    'current_reading' => $current,
                    'previous_reading' => $previous,
                    'consumption' => $consumption,
                    'price_per_cube' => $pricePerCube,
                    'total_amount' => $total,
                    'rounded_amount' => round($total),
                    'days_consumption' => 30 // Por defecto, puede ajustarse
                ]);
            }
            
            DB::commit();
            return response()->json(['message' => 'Lecturas guardadas exitosamente'], 201);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Error al guardar lecturas: ' . $e->getMessage()], 500);
        }
    }

    // Generar PDF de preaviso
    public function generatePreaviso($month, $year)
    {
        $readings = $this->getByMonthYear($month, $year)->getData();
        
        // Aquí implementar la generación del PDF usando las plantillas
        // Usar una librería como dompdf o mpdf
        
        return response()->json([
            'pdf_url' => '/storage/preavisos/preaviso-' . $month . '-' . $year . '.pdf',
            'data' => $readings
        ]);
    }
}