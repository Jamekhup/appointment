<?php

namespace App\Http\Controllers\api;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;
use App\Models\ServiceCharge;

class SettingController extends Controller
{
    public function index(){
        $user = User::select('name','email','role','created_at','created_by')->where('id','=', Auth::user()->id)->first();
        $charges = ServiceCharge::first();
        if($user){
            return response()->json(['status' => 'success','user' => $user, 'charges' => $charges]);
        }
    }

    public function update_password(Request $request){
        $credentials = Validator::make($request->all(), [
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        if ($credentials->fails()) {

            return response()->json(['status' => 'fail', 'message' => $credentials->errors()], 422);
        }

        $currentPass = $request->currentPassword;
        $password = $request->password;

        $user = User::where('id', '=', Auth::user()->id)->first();
        if ($user) {
            if (!Hash::check($currentPass, $user->password)) {
                return response()->json(['status' => 'fail', 'message' => 'Current password is incorrect']);
            } else {
                $user->password = Hash::make($password);

                if ($user->save()) {
                    $request->user()->currentAccessToken()->delete();
                    return response()->json(['status' => 'success', 'message' => 'Password reset wass success. Login with new password.']);
                }
            }
        }
    }


    public function create_service_charges(Request $request){
        $input = Validator::make($request->all(), [
            'amount' => 'required|numeric'
        ]);

        if ($input->fails()) {
            return response()->json(['status' => 'fail', 'message' => $input->errors()], 422);
        }

        $check = ServiceCharge::first();
        if($check){
            $check->amount = $request->amount;
            $check->updated_by = Auth::user()->name;

            if($check->save()){
                return response()->json(['status' => 'success']);
            }else{
                return response()->json(['status' => 'fail']);
            }
        }else{
            $charges = new ServiceCharge();
            $charges->amount = $request->amount;
            $charges->created_by = Auth::user()->name;

            if($charges->save()){
                return response()->json(['status' => 'success']);
            }else{
                return response()->json(['status' => 'fail']);
            }
        }
    }

}

