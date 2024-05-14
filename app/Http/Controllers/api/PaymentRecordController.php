<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Models\PaymentRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class PaymentRecordController extends Controller
{
    public function index(){

        $patient = Patient::all();
        $payment = PaymentRecord::with('patient')->orderBy('created_at', 'DESC')->get();

        if($patient || $payment){
            return response()->json(['status' =>'success', 'patient' => $patient, 'payment' => $payment]);
        }

    }

    public function detail($id){

        $payment = PaymentRecord::with('patient')->find($id);
        if($payment){
            return response()->json(['status' =>'success', 'payment' => $payment]);
        }else{
            return response()->json(['status' => 'fail','message' => 'Something went wrong'], 422);
        }

    }

    public function create_existed(Request $request){

        // $input = Validator::make($request->all(), [
        //     'patient_id' =>'required',
        //     'treatment' => 'required',
        //     'doctorName' =>'required',
        //     'coveredByInsuranceCompnany' =>'required',
        //     'number' =>'required',
        //     'cost' =>'required',
        //     'homeVisit' =>'required',
        //     'totalPayment' =>'required'
        // ]);

        // if ($input->fails()) {
        //     return response()->json(['status' => 'fail', 'errors' => $input->errors()], 422);
        // }


        try {
            $payment = new PaymentRecord();
            $payment->patient_id = $request->patient_id;
            $payment->issue_date = date('Y-m-d');
            $payment->treatment = $request->treatment;
            $payment->doctor_name = $request->doctorName;
            $payment->full_covered_by_insurance_company = $request->coveredByInsuranceCompany;
            $payment->number = $request->number;
            $payment->cost = $request->cost;
            $payment->additional_payment = $request->additionalPayment;
            $payment->home_visit = $request->homeVisit;
            $payment->number2 = $request->number2;
            $payment->cost3 = $request->cost3;
            $payment->additional_payment_4 = $request->additionalPayment4;
            $payment->total_payment = $request->totalPayment;
            $payment->received_by = Auth::user()->name;
            $payment->received_date = date('Y-m-d');
            $payment->remark = $request->remark;
            $payment->created_by = Auth::user()->name;

            if($payment->save()){
                return response()->json(['status' =>'success', 'payment' => $payment]);
            }
        } catch (\Throwable $th) {
            return response()->json($th);
        }

    }

    public function create_new(Request $request){

        try {
            DB::beginTransaction();

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

            if($patient->save()){

                $payment = new PaymentRecord();
                $payment->patient_id = $patient->id;
                $payment->issue_date = date('Y-m-d');
                $payment->treatment = $request->newTreatment;
                $payment->doctor_name = $request->newDoctorName;
                $payment->full_covered_by_insurance_company = $request->newCoveredByInsuranceCompany;
                $payment->number = $request->newNumber;
                $payment->cost = $request->newCost;
                $payment->additional_payment = $request->newAdditionalPayment;
                $payment->home_visit = $request->newHomeVisit;
                $payment->number2 = $request->newNumber2;
                $payment->cost3 = $request->newCost3;
                $payment->additional_payment_4 = $request->newAdditionalPayment4;
                $payment->total_payment = $request->newTotalPayment;
                $payment->received_by = Auth::user()->name;
                $payment->received_date = date('Y-m-d');
                $payment->remark = $request->newRemark;
                $payment->created_by = Auth::user()->name;

                if($payment->save()){
                    DB::commit();
                    return response()->json(['status' =>'success',  'payment' => $payment]);
                }
            }


        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json($th);
            
        }

    }

    public function update(Request $request, $id){

    }

    public function delete($id){
        $payment = PaymentRecord::find($id);
        if($payment){
            $payment->delete();
            return response()->json(['status' =>'success']);
        }
    }
}

