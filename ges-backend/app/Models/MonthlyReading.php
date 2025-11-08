<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MonthlyReading extends Model
{
    use HasFactory;

    protected $fillable = [
        'reading_date',
        'lectura1',
        'lectura2',
        'total_reading',
        'periodo'
    ];

    protected $casts = [
        'reading_date' => 'date',
        'lectura1' => 'decimal:2',
        'lectura2' => 'decimal:2',
        'total_reading' => 'decimal:2'
    ];

    // Relación: Una lectura mensual tiene muchas lecturas de departamento
    public function departmentReadings()
    {
        return $this->hasMany(DepartmentReading::class);
    }

    // Método para calcular el precio unitario
    public function getUnitPriceAttribute()
    {
        $totalConsumption = $this->departmentReadings->sum('consumption');
        return $totalConsumption > 0 
            ? round($this->total_reading / $totalConsumption, 2) 
            : 0;
    }

    // Método para obtener el total en Bs
    public function getTotalBsAttribute()
    {
        return $this->departmentReadings->sum('total_bs');
    }

    // Método para obtener el total redondeado
    public function getTotalBsRoundedAttribute()
    {
        return $this->departmentReadings->sum('total_bs_rounded');
    }
}