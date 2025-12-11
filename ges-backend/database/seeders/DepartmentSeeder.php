<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Department;
use Illuminate\Support\Facades\DB;

class DepartmentSeeder extends Seeder
{
    public function run()
    {
        $departments = [
            ['code' => 'PB-A', 'name' => 'PB - A', 'floor' => 'PB', 'section' => 'A'],
            ['code' => '1-A', 'name' => '1 - A', 'floor' => '1', 'section' => 'A'],
            ['code' => '2-A', 'name' => '2 - A', 'floor' => '2', 'section' => 'A'],
            ['code' => '3-A', 'name' => '3 - A', 'floor' => '3', 'section' => 'A'],
            ['code' => '4-A', 'name' => '4 - A', 'floor' => '4', 'section' => 'A'],
            ['code' => '5-A', 'name' => '5 - A', 'floor' => '5', 'section' => 'A'],
            ['code' => '6-A', 'name' => '6 - A', 'floor' => '6', 'section' => 'A'],
            ['code' => 'PB-B', 'name' => 'PB - B', 'floor' => 'PB', 'section' => 'B'],
            ['code' => '1-B', 'name' => '1 - B', 'floor' => '1', 'section' => 'B'],
            ['code' => '2-B', 'name' => '2 - B', 'floor' => '2', 'section' => 'B'],
            ['code' => '3-B', 'name' => '3 - B', 'floor' => '3', 'section' => 'B'],
            ['code' => '4-B', 'name' => '4 - B', 'floor' => '4', 'section' => 'B'],
            ['code' => '5-B', 'name' => '5 - B', 'floor' => '5', 'section' => 'B'],
            ['code' => '6-B', 'name' => '6 - B', 'floor' => '6', 'section' => 'B'],
            ['code' => 'GENERAL', 'name' => 'General', 'floor' => 'General', 'section' => 'General'],
        ];

        foreach ($departments as $department) {
            Department::create($department);
        }
    }
}