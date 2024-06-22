<?php

namespace App\Http\Controllers\api;

use App\Exports\PaymentRecordExport;
use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Models\PaymentRecord;
use App\Models\Service;
use App\Models\ServiceCharge;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class PaymentRecordController extends Controller
{
    
    public function index(Request $request)
    {

        $patient = Patient::all();
        $therapist = User::where('role', 2)->get();
        $services = Service::all();
        $payment = PaymentRecord::with(['patient', 'user'])->when($request->dateRange, function ($query, $date) {
            $query->whereDate('issue_date', '>=', Carbon::parse($date[0])->addDay()->format('Y-m-d'))
                ->whereDate('issue_date', '<=', Carbon::parse($date[1])->addDay()->format('Y-m-d'));
        })->orderBy('created_at', 'DESC')->paginate(30);

        $charges = ServiceCharge::first();

        if ($payment) {
            return response()->json(
                ['status' => 'success', 
                'patient' => $patient, 
                'payment' => $payment, 
                'therapist' => $therapist,
                'services' => $services,
                'charges' => $charges
            ]);
        }
    }

    public function detail($id)
    {

        $payment = PaymentRecord::with(['patient', 'user'])->find($id);
        if ($payment) {
            return response()->json(['status' => 'success', 'payment' => $payment]);
        } else {
            return response()->json(['status' => 'fail', 'message' => 'Something went wrong'], 422);
        }
    }

    public function create_existed(Request $request)
    {

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
            $payment->treatment = json_encode($request->treatment);
            $payment->user_id = $request->therapistId;
            $payment->doctor_name = $request->doctorName;
            $payment->full_covered_by_insurance_company = $request->coveredByInsuranceCompany;
            $payment->total_payment = 0;
            $payment->charges = $request->charges;
            $payment->received_by = Auth::user()->name;
            $payment->received_date = date('Y-m-d');
            $payment->remark = $request->remark;
            $payment->created_by = Auth::user()->name;

            if ($payment->save()) {
                return response()->json(['status' => 'success', 'payment' => $payment]);
            }
        } catch (\Throwable $th) {
            return response()->json($th);
        }
    }


    public function edit($id)
    {
        $payment = PaymentRecord::with(['patient', 'user'])->find($id);
        $patients = Patient::all();
        $therapist = User::where('role', 2)->get();
        $services = Service::all();
        if ($payment) {
            return response()->json(
                ['status' => 'success', 
                'payment' => $payment, 
                'patient' => $patients, 
                'therapist' => $therapist,
                'services' => $services,
            ]);
        } else {
            return response()->json(['status' => 'fail', 'message' => 'Something went wrong'], 422);
        }
    }

    public function update(Request $request, $id)
    {

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
            $payment = PaymentRecord::find($id);
            if ($payment) {

                if ($request->patient_id) {
                    $payment->patient_id = $request->patient_id;
                }
                $payment->treatment = json_encode($request->treatment);
                $payment->user_id = $request->therapistId;
                $payment->doctor_name = $request->doctorName;
                $payment->full_covered_by_insurance_company = $request->coveredByInsuranceCompany;
                $payment->updated_by = Auth::user()->name;
                $payment->updated_at = date('Y-m-d H:i:s');

                if ($payment->save()) {
                    return response()->json(['status' => 'success', 'payment' => $payment]);
                }
            }
        } catch (\Throwable $th) {
            return response()->json($th);
        }
    }

    public function delete($id)
    {
        $payment = PaymentRecord::find($id);
        if ($payment) {
            $payment->delete();
            return response()->json(['status' => 'success']);
        }
    }
}
