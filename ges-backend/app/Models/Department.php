<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    protected $fillable = ['code', 'name', 'floor', 'section'];

    public static function getDepartments()
    {
        return [
            ['id' => 1, 'code' => 'PB-A', 'name' => 'PB - A', 'floor' => 'PB', 'section' => 'A'],
            ['id' => 2, 'code' => '1-A', 'name' => '1 - A', 'floor' => '1', 'section' => 'A'],
            ['id' => 3, 'code' => '2-A', 'name' => '2 - A', 'floor' => '2', 'section' => 'A'],
            ['id' => 4, 'code' => '3-A', 'name' => '3 - A', 'floor' => '3', 'section' => 'A'],
            ['id' => 5, 'code' => '4-A', 'name' => '4 - A', 'floor' => '4', 'section' => 'A'],
            ['id' => 6, 'code' => '5-A', 'name' => '5 - A', 'floor' => '5', 'section' => 'A'],
            ['id' => 7, 'code' => '6-A', 'name' => '6 - A', 'floor' => '6', 'section' => 'A'],
            ['id' => 8, 'code' => 'PB-B', 'name' => 'PB - B', 'floor' => 'PB', 'section' => 'B'],
            ['id' => 9, 'code' => '1-B', 'name' => '1 - B', 'floor' => '1', 'section' => 'B'],
            ['id' => 10, 'code' => '2-B', 'name' => '2 - B', 'floor' => '2', 'section' => 'B'],
            ['id' => 11, 'code' => '3-B', 'name' => '3 - B', 'floor' => '3', 'section' => 'B'],
            ['id' => 12, 'code' => '4-B', 'name' => '4 - B', 'floor' => '4', 'section' => 'B'],
            ['id' => 13, 'code' => '5-B', 'name' => '5 - B', 'floor' => '5', 'section' => 'B'],
            ['id' => 14, 'code' => '6-B', 'name' => '6 - B', 'floor' => '6', 'section' => 'B'],
            ['id' => 15, 'code' => 'GENERAL', 'name' => 'General', 'floor' => 'General', 'section' => 'General'],
        ];
    }
}