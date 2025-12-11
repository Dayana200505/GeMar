<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    public function index()
    {
        $expenses = Expense::orderBy('date', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json($expenses);
    }

    public function store(Request $request)
    {
        $request->validate([
            'description' => 'required|string|max:255',
            'invoice_number' => 'nullable|string|max:50',
            'amount' => 'required|numeric|min:0',
            'date' => 'required|date'
        ]);

        $expense = Expense::create([
            'description' => $request->description,
            'invoice_number' => $request->invoice_number,
            'amount' => $request->amount,
            'date' => $request->date
        ]);

        return response()->json($expense, 201);
    }

    public function destroy($id)
    {
        $expense = Expense::findOrFail($id);
        $expense->delete();
        
        return response()->json(['message' => 'Gasto eliminado correctamente']);
    }
}