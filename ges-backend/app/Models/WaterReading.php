<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WaterReading extends Model
{
    protected $fillable = [
        'department_id',
        'reading_date',
        'current_reading',
        'previous_reading',
        'consumption',
        'price_per_cube',
        'total_amount',
        'rounded_amount',
        'days_consumption'
    ];

    protected $casts = [
        'reading_date' => 'date',
        'current_reading' => 'decimal:2',
        'previous_reading' => 'decimal:2',
        'consumption' => 'decimal:2',
        'price_per_cube' => 'decimal:4',
        'total_amount' => 'decimal:2',
        'rounded_amount' => 'decimal:2'
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }
}