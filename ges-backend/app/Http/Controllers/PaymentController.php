<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\WaterReading;
use Illuminate\Http\Request;
use Carbon\Carbon;

class PaymentController extends Controller
{
    // Obtener pagos por mes
    public function getByMonth($month, $year)
    {
        $payments = Payment::with(['department', 'waterReading'])
            ->whereMonth('month', $month)
            ->whereYear('month', $year)
            ->get();
        
        return response()->json($payments);
    }

    // Actualizar estado de pago
    public function updatePayment(Request $request, $id)
    {
        $payment = Payment::findOrFail($id);
        
        $request->validate([
            'status' => 'required|in:pending,paid',
            'paid_amount' => 'nullable|numeric',
            'payment_date' => 'nullable|date'
        ]);
        
        $payment->update([
            'status' => $request->status,
            'paid_amount' => $request->paid_amount,
            'payment_date' => $request->payment_date
        ]);
        
        return response()->json($payment);
    }

    // Crear registros de pago automáticamente
    public function createMonthlyPayments(Request $request)
    {
        $request->validate([
            'month' => 'required|date',
            'expenses_amount' => 'required|numeric|min:0'
        ]);
        
        $month = Carbon::parse($request->month);
        $waterReadings = WaterReading::whereMonth('reading_date', $month->month)
            ->whereYear('reading_date', $month->year)
            ->where('department_id', '!=', 15) // Excluir GENERAL
            ->get();
        
        foreach ($waterReadings as $reading) {
            Payment::updateOrCreate([
                'department_id' => $reading->department_id,
                'month' => $month->format('Y-m-d')
            ], [
                'water_reading_id' => $reading->id,
                'expenses_amount' => $request->expenses_amount,
                'water_amount' => $reading->rounded_amount,
                'total_amount' => $request->expenses_amount + $reading->rounded_amount,
                'status' => 'pending'
            ]);
        }
        
        return response()->json(['message' => 'Pagos mensuales creados']);
    }
}