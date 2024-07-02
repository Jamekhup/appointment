<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Imports\PatientImport;
use App\Models\Patient;
use App\Models\Service;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use PhpOffice\PhpSpreadsheet\IOFactory;

class PatientController extends Controller
{
    public function index()
    {
        $patients = Patient::orderBy('created_at', 'desc')->paginate(30);
        return response()->json(['status' => 'success', 'patients' => $patients]);
    }

    public function get_all()
    {
        $patients = Patient::all();
        $services = Service::all();
        if (Auth::user()->role == 0 || Auth::user()->role == 1) {
            $therapists = User::where('role', 2)->get();
        } else {
            $therapists = null;
        }

        return response()->json([
            'status' => 'success',
            'patients' => $patients,
            'services' => $services,
            'therapists' => $therapists
        ]);
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
            'email' => 'required|email',
            'phone' => 'required',
            'dob' => 'required',
            'street' => 'required',
            'houseNumber' => 'required',
            'city' => 'required',
            'postalCode' => 'required',
            'paymentFree' => 'required',
        ]);

        if ($input->fails()) {
            return response()->json(['status' => 'fail', 'message' => $input->errors()], 422);
        }

        $patient = new Patient();
        $patient->title = $request->title;
        $patient->first_name = $request->firstName;
        $patient->last_name = $request->lastName;
        $patient->email = $request->email;
        $patient->phone = $request->phone;
        $patient->dob = Carbon::parse($request->dob)->addDay()->format('Y-m-d');
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
            return response()->json(['status' => 'success', 'data' => $patient]);
        } else {
            return response()->json(['status' => 'fail', 'message' => 'Something went wrong'], 422);
        }
    }


    public function excel_upload(Request $request){

        $input = Validator::make($request->all(), [
            'file' => 'required|mimes:xlsx,xls|max:5120',
        ]);

        if ($input->fails()) {
            return response()->json(['status' => 'fail', 'message' => $input->errors()], 422);
        }

        $file = $request->file('file');

        $spreadsheet = IOFactory::load($file->getPathname());
        $worksheet = $spreadsheet->getActiveSheet();
        $data = $worksheet->toArray();

        foreach ($data as $key => $row) {
            if($key > 0){
                $patient = new Patient();
                $patient->title = $row[0];
                $patient->first_name = $row[1];
                $patient->last_name = $row[2];
                $patient->email = $row[3];
                $patient->phone = $row[4];
                $patient->dob = Carbon::parse($row[5])->addDay()->format('Y-m-d');
                $patient->street = $row[6];
                $patient->house_number = $row[7];
                $patient->city = $row[8];
                $patient->postal_code = $row[9];
                $patient->house_doctor = $row[10];
                $patient->recommended_doctor = $row[11];
                $patient->health_insurance_company = $row[12];
                $patient->payment_free = $row[13];
                $patient->treatment_in_6_month = $row[14];
                $patient->private_patient = $row[15];
                $patient->special_need = $row[16];
                $patient->created_by = Auth::user()->name;
                $patient->save();
            }
        }

        return response()->json(['status' => 'success', 'message' => 'Patient File imported successfully']);
    }


    public function update(Request $request, $id)
    {
        $input = Validator::make($request->all(), [
            'title' => 'required|max:4',
            'firstName' => 'required|max:50',
            'lastName' => 'required|max:50',
            'email' => 'required|email',
            'phone' => 'required',
            'dob' => 'required',
            'street' => 'required',
            'houseNumber' => 'required',
            'city' => 'required',
            'postalCode' => 'required',
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
            $patient->email = $request->email;
            $patient->phone = $request->phone;
            $patient->dob = Carbon::parse($request->dob)->addDay()->format('Y-m-d');
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
