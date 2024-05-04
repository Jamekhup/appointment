<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class EmployeeController extends Controller
{
    public function index()
    {
        $employee = User::where('role', 2)->orderBy('created_at', 'desc')->get();
        return response()->json(['employee' => $employee]);
    }

    public function create(Request $request)
    {

        $input = Validator::make($request->all(), [
            'name' => 'required|max:150',
            'email' => 'required|email|max:50',
            'password' => 'required|max:50',
        ]);

        if ($input->fails()) {
            return response()->json(['status' => 'fail', 'message' => $input->errors()], 422);
        }

        $employee = new User();
        $employee->name = $request->name;
        $employee->email = $request->email;
        $employee->password = $request->password;
        $employee->email_verified_at = now();
        $employee->role = 2;
        $employee->dashboard_access = $request->dashboardAccess;
        $employee->appointment_access = $request->appointmentAccess;
        $employee->appointment_list_access = $request->appointmentListAccess;
        $employee->patient_access = $request->patientAccess;
        $employee->payment_record_access = $request->paymentAccess;
        $employee->service_access = $request->serviceAccess;
        $employee->employee_access = $request->employeeAccess;
        $employee->created_by = Auth::user()->name;
        if ($employee->save()) {
            return response()->json($employee);
        }
    }
    public function update(Request $request, $id)
    {
        $employee = User::where('id', $id)->first();
        if ($employee) {
            $employee->name = $request->name;
            $employee->email = $request->email;
            $employee->dashboard_access = $request->dashboardAccess;
            $employee->appointment_access = $request->appointmentAccess;
            $employee->appointment_list_access = $request->appointmentListAccess;
            $employee->patient_access = $request->patientAccess;
            $employee->payment_record_access = $request->paymentAccess;
            $employee->service_access = $request->serviceAccess;
            $employee->employee_access = $request->employeeAccess;
            $employee->updated_by = Auth::user()->name;
            if ($employee->save()) {
                return response()->json($employee);
            }
        }
    }

    public function delete($id)
    {
        $employee = User::where('id', $id)->first();
        if ($employee) {
            $employee->delete();
            return response()->json(201);
        }
    }
}