<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class PatientController extends Controller
{
    public function index()
    {
        $patients = Patient::orderBy('created_at', 'desc')->get();
        return response()->json(['status' => 'success', 'patients' => $patients]);
    }

    public function detail($id)
    {
        $patient = Patient::where('id', $id)->first();
        if ($patient) {
            return response()->json(['status' => 'success', 'patient' => $patient]);
        } else {
            return response()->json(['status' => 'fail', 'message' => 'Something went wrong'], 422);
        }
    }

    public function create(Request $request)
    {

        $input = Validator::make($request->all(), [
            'title' => 'required|max:4',
            'firstName' => 'required|max:50',
            'lastName' => 'required|max:50',
            'dob' => 'required',
            'street' => 'required',
            'houseNumber' => 'required',
            'city' => 'required',
            'postalCode' => 'required|digits:6',
            'paymentFree' => 'required',
        ]);

        if ($input->fails()) {
            return response()->json(['status' => 'fail', 'message' => $input->errors()], 422);
        }

        $patient = new Patient();
        $patient->title = $request->title;
        $patient->first_name = $request->firstName;
        $patient->last_name = $request->lastName;
        $patient->dob = $request->dob;
        $patient->street = $request->street;
        $patient->house_number = $request->houseNumber;
        $patient->city = $request->city;
        $patient->postal_code = $request->postalCode;
        $patient->house_doctor = $request->houseDoctor;
        $patient->recommended_doctor = $request->recommendedDoctor;
        $patient->health_insurance_company = $request->insuranceCompany;
        $patient->payment_free = $request->paymentFree;
        $patient->treatment_in_6_month = $request->treatmentInSixMonth;
        $patient->private_patient = $request->privatePatient;
        $patient->special_need = $request->specialNeed;
        $patient->created_by = Auth::user()->name;


        if ($patient->save()) {
            return response()->json([
                'status' => 'success',
                'data' => $patient
            ]);
        } else {
            return response()->json(['status' => 'fail', 'message' => 'Something went wrong'], 422);
        }
    }
    public function update(Request $request, $id)
    {
        $input = Validator::make($request->all(), [
            'title' => 'required|max:4',
            'firstName' => 'required|max:50',
            'lastName' => 'required|max:50',
            'dob' => 'required',
            'street' => 'required',
            'houseNumber' => 'required',
            'city' => 'required',
            'postalCode' => 'required|digits:6',
            'paymentFree' => 'required',
        ]);

        if ($input->fails()) {
            return response()->json(['status' => 'fail', 'message' => $input->errors()], 422);
        }

        $patient = Patient::where('id', $id)->first();
        if ($patient) {
            $patient->title = $request->title;
            $patient->first_name = $request->firstName;
            $patient->last_name = $request->lastName;
            $patient->dob = $request->dob;
            $patient->street = $request->street;
            $patient->house_number = $request->houseNumber;
            $patient->city = $request->city;
            $patient->postal_code = $request->postalCode;
            $patient->house_doctor = $request->houseDoctor;
            $patient->recommended_doctor = $request->recommendedDoctor;
            $patient->health_insurance_company = $request->insuranceCompany;
            $patient->payment_free = $request->paymentFree;
            $patient->treatment_in_6_month = $request->treatmentInSixMonth;
            $patient->private_patient = $request->privatePatient;
            $patient->special_need = $request->specialNeed;
            $patient->created_by = Auth::user()->name;


            if ($patient->save()) {
                return response()->json([
                    'status' => 'success',
                ]);
            } else {
                return response()->json(['status' => 'fail', 'message' => 'Something went wrong'], 422);
            }
        }
    }

    public function delete($id)
    {
        $patient = Patient::where('id', $id)->first();
        if ($patient) {
            $patient->delete();
            return response(['status' => 'success'], 200);
        }
    }
}
