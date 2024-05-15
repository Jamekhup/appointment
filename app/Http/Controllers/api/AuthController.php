<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if ($credentials->fails()) {
            return response()->json(['status' => 'fail', 'message' => $credentials->errors()], 422);
        }


        try {

            $email = $request->email;
            $password = $request->password;

            if (Auth::attempt(['email' => $email, 'password' => $password])) {

                if (Auth::user()->email_verified_at == null) {
                    return response()->json(['status' => 'fail', 'message' => 'Your email is not verified yet'], 422);
                    $request->user()->currentAccessToken()->delete();
                } else {
                    $user = User::select('id', 'role', 'name', 'dashboard_access', 'appointment_access', 'appointment_list_access', 'patient_access', 'payment_record_access', 'service_access', 'employee_access')->where('id', Auth::user()->id)->whereNotNull('email_verified_at')->first();
                    return response()->json([
                        'status' => 'success',
                        'id' => $user->id,
                        'role' => $user->role,
                        'dashboardAccess' => $user->dashboard_access,
                        'appointmentAccess' => $user->appointment_access,
                        'appointmentListAccess' => $user->appointment_list_access,
                        'patientAccess' => $user->patient_access,
                        'paymentAccess' => $user->payment_record_access,
                        'serviceAccess' => $user->service_access,
                        'employeeAccess' => $user->employee_access,
                        'user' => $user->name,
                        'token' => auth()->user()->createToken('app_sys')->plainTextToken
                    ], 200);
                }
            }


            return response()->json(['status' => 'fail', 'message' => 'Email or password incorrect'], 422);
        } catch (\Exception $e) {

            return response()->json($e);
        }
    }


    public function forgot_password()
    {
    }

    public function reset_password(Request $request)
    {
    }
}
