<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class TherapistController extends Controller
{
    public function index()
    {
        $employee = User::where('role','!=',0 )->orderBy('created_at', 'desc')->get();
        return response()->json(['employee' => $employee]);
    }

    public function create(Request $request)
    {

        $input = Validator::make($request->all(), [
            'name' => 'required|max:150',
            'email' => 'required|email|max:50',
            'role' => 'required',
            'password' => 'required|max:50',
        ]);

        if ($input->fails()) {
            return response()->json(['status' => 'fail', 'message' => $input->errors()], 422);
        }

        if($request->role == 2){
            $employee = new User();
            $employee->name = $request->name;
            $employee->email = $request->email;
            $employee->password = $request->password;
            $employee->email_verified_at = now();
            $employee->role = $request->role;
            $employee->dashboard_access = 1;
            $employee->appointment_access = 1;
            $employee->appointment_list_access = $request->appointmentListAccess;
            $employee->patient_access = $request->patientAccess;
            $employee->payment_record_access = $request->paymentAccess;
            $employee->service_access = $request->serviceAccess;
            $employee->employee_access = $request->employeeAccess;
            $rand = array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F');
            $color = '#' . $rand[rand(0, 15)] . $rand[rand(0, 15)] . $rand[rand(0, 15)] . $rand[rand(0, 15)] . $rand[rand(0, 15)] . $rand[rand(0, 15)];
            $employee->color = $color;
            $employee->created_by = Auth::user()->name;
            if ($employee->save()) {
                return response()->json($employee);
            }
        }

        if($request->role == 1){
            $employee = new User();
            $employee->name = $request->name;
            $employee->email = $request->email;
            $employee->password = $request->password;
            $employee->email_verified_at = now();
            $employee->role = $request->role;
            $employee->dashboard_access = 1;
            $employee->appointment_access = 1;
            $employee->appointment_list_access = 1;
            $employee->patient_access = 1;
            $employee->payment_record_access = 1;
            $employee->service_access = 1;
            $employee->employee_access = 1;
            $rand = array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F');
            $color = '#' . $rand[rand(0, 15)] . $rand[rand(0, 15)] . $rand[rand(0, 15)] . $rand[rand(0, 15)] . $rand[rand(0, 15)] . $rand[rand(0, 15)];
            $employee->color = $color;
            $employee->created_by = Auth::user()->name;
            if ($employee->save()) {
                return response()->json($employee);
            }
        }
    }
    public function update(Request $request, $id)
    {

        $input = Validator::make($request->all(), [
            'name' => 'required|max:150',
            'email' => 'required|email|max:50',
            'role' => 'required',
            'password' => 'max:50',
        ]);

        if ($input->fails()) {
            return response()->json(['status' => 'fail', 'message' => $input->errors()], 422);
        }
        
        if($request->role == 2){
            $employee = User::where('id', $id)->first();
            if ($employee) {
                $employee->name = $request->name;
                $employee->email = $request->email;
                $employee->role = $request->role;
                if ($request->password) {
                    $employee->password = $request->password;
                }
                $employee->dashboard_access = 1;
                $employee->appointment_access = 1;
                $employee->appointment_list_access = $request->appointmentListAccess;
                $employee->patient_access = $request->patientAccess;
                $employee->payment_record_access = $request->paymentAccess;
                $employee->service_access = $request->serviceAccess;
                $employee->employee_access = $request->employeeAccess;
                $employee->updated_by = Auth::user()->name;
                $employee->updated_at = now();
                if ($employee->save()) {
                    return response()->json($employee);
                }
            }
        }

        if($request->role == 1){
            $employee = User::where('id', $id)->first();
            if ($employee) {
                $employee->name = $request->name;
                $employee->email = $request->email;
                $employee->role = $request->role;
                if ($request->password) {
                    $employee->password = $request->password;
                }
                $employee->dashboard_access = 1;
                $employee->appointment_access = 1;
                $employee->appointment_list_access = 1;
                $employee->patient_access = 1;
                $employee->payment_record_access = 1;
                $employee->service_access = 1;
                $employee->employee_access = 1;
                $employee->updated_by = Auth::user()->name;
                $employee->updated_at = now();
                if ($employee->save()) {
                    return response()->json($employee);
                }
            }

        }

    }

    public function delete($id)
    {
        $employee = User::where('id', $id)->where('role','!=',0)->first();
        if ($employee) {
            $employee->delete();
            return response()->json(201);
        }
    }
}
