Route::middleware('auth:sanctum')->group(function () {
    // Lecturas de agua
    Route::get('/water-readings', [WaterController::class, 'index']);
    Route::get('/water-readings/{month}/{year}', [WaterController::class, 'getByMonthYear']);
    Route::post('/water-readings', [WaterController::class, 'store']);
    Route::get('/generate-preaviso/{month}/{year}', [WaterController::class, 'generatePreaviso']);
    
    // Departamentos
    Route::get('/departments', function () {
        return response()->json(\App\Models\Department::getDepartments());
    });
    
    // Pagos
    Route::get('/payments/{month}/{year}', [PaymentController::class, 'getByMonth']);
    Route::post('/create-payments', [PaymentController::class, 'createMonthlyPayments']);
    Route::put('/payments/{id}', [PaymentController::class, 'updatePayment']);
    
    // Gastos
    Route::get('/expenses', [ExpenseController::class, 'index']);
    Route::post('/expenses', [ExpenseController::class, 'store']);
    Route::delete('/expenses/{id}', [ExpenseController::class, 'destroy']);
});