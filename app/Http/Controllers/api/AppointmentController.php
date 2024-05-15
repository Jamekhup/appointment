<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Patient;
use App\Models\ReserveAppointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class AppointmentController extends Controller
{
    public function index()
    {
        if (Auth::user()->appointment_access == 1) {
            $appointments = Appointment::with('patient', 'user', 'service')->where('status', 0)->get();
        } else {
            $appointments = Appointment::with('patient', 'user', 'service')->where('user_id', Auth::user()->id)->where('status', 0)->get();
        }
        $reserved = ReserveAppointment::all();

        $events = [];
        foreach ($appointments as $appointment) {
            $add1_hour_to_start_time = date('Y-m-d H:i:s', strtotime($appointment['date'] . $appointment['time'] . ' +1 hour'));
            $events[] = [
                'id' => $appointment['id'],
                'start' => date('Y-m-d H:i:s', strtotime($appointment['date'] . $appointment['time'])),
                'end' => $add1_hour_to_start_time,
                'title' => $appointment['patient']['title'] . ' ' .
                    $appointment['patient']['first_name'] . ' ' .
                    $appointment['patient']['last_name'] .
                    ' ( ' . $appointment['service']['name'] . ' ) ',

                'backgroundColor' => $appointment['user']['color'],
                'status' => $appointment['status'],
                'data' => $appointment
            ];
        }

        foreach ($reserved as $reserve) {
            $events[] = [
                'id' => $reserve['id'],
                'start' => date('Y-m-d H:i:s', strtotime($reserve['date'] . $reserve['from_time'])),
                'end' => date('Y-m-d H:i:s', strtotime($reserve['date'] . $reserve['to_time'])),
                'title' => "Reserved",
                'backgroundColor' => "red",
            ];
        }

        return response()->json(['events' => $events]);
    }

    public function appointmentList()
    {
        $appointments = Appointment::orderBy('created_at','DESC')->paginate(30);
        return response()->json(['appointments' => $appointments]);
    }

    public function create(Request $request)
    {
        $input = Validator::make($request->all(), [
            'serviceId' => 'required',
            // 'patientId' => '',
            'date' => 'required',
            'time' => 'required',
        ]);

        if ($input->fails()) {
            return response()->json(['status' => 'fail', 'message' => $input->errors()], 422);
        }

        $reserved = ReserveAppointment::where('date', date('Y-m-d', strtotime($request->date)))
            ->where('from_time', '<=', date('H:i:s', strtotime($request->time)))
            ->where('to_time', '>=', date('H:i:s', strtotime($request->time)))
            ->first();

        if ($reserved) {
            return response()->json([
                'status' => 'reserved',
                'message' => date('Y-m-d', strtotime($request->date)) . " " . date('H:i:s', strtotime($request->time)) . ' Reserved'
            ]);
        } else {
            try {
                DB::beginTransaction();

                $appointment = new Appointment();

                if ($request->patientId) {
                    $appointment->patient_id = $request->patientId;
                } else {
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
                        $appointment->patient_id = $patient->id;
                    }
                }

                $appointment->service_id = $request->serviceId;
                $appointment->user_id = Auth::user()->id;
                $appointment->doctor_name = $request->doctor;
                $appointment->date = $request->date;
                $appointment->time = $request->time;
                $appointment->comment = $request->comment;
                $appointment->created_by = Auth::user()->name;
                if ($appointment->save()) {
                    $get_appointment = Appointment::with('patient', 'user', 'service')->find($appointment->id);
                    $event = $this->event($get_appointment);

                    DB::commit();

                    return response()->json(['status' => 'success', 'data' => $event]);
                }
            } catch (\Throwable $th) {
                DB::rollBack();
                //throw $th;
                return response()->json(['status' => 'fail', 'message' => $th->getMessage()], 422);
            }
        }
    }

    public function update(Request $request, $id)
    {
        $input = Validator::make($request->all(), [
            'serviceId' => 'required',
            'patientId' => 'required',
            'date' => 'required',
            'time' => 'required',
            'status' => 'required',
        ]);

        if ($input->fails()) {
            return response()->json(['status' => 'fail', 'message' => $input->errors()], 422);
        }

        $reserved = ReserveAppointment::where('date', date('Y-m-d', strtotime($request->date)))
            ->where('from_time', '<=', date('H:i:s', strtotime($request->time)))
            ->where('to_time', '>=', date('H:i:s', strtotime($request->time)))
            ->first();

        if ($reserved) {
            return response()->json([
                'status' => 'reserved',
                'message' => date('Y-m-d', strtotime($request->date)) . " " . date('H:i:s', strtotime($request->time)) . ' Reserved'
            ]);
        } else {
            $appointment = Appointment::with('patient', 'user', 'service')->where('id', $id)->first();
            if ($appointment) {
                $appointment->service_id = $request->serviceId;
                $appointment->user_id = Auth::user()->id;
                $appointment->doctor_name = $request->doctor;
                $appointment->date = $request->date;
                $appointment->time = $request->time;
                $appointment->status = $request->status;
                $appointment->comment = $request->comment;
                $appointment->updated_by = Auth::user()->name;
                if ($appointment->save()) {

                    return response()->json(['status' => 'success', 'data' => $appointment]);
                }
            }
            return response()->json(['status' => 'fail', 'message' => "Something went wrong"], 422);
        }
    }

    public function detail($id)
    {
        $appointment = Appointment::with('user', 'service', 'patient')->where('id', $id)->first();
        if ($appointment) {
            return response()->json(['status' => 'success', 'data' => $appointment]);
        }
    }

    public function finished($id)
    {
        $appointment = Appointment::where('id', $id)->first();
        if ($appointment) {
            $appointment->finish_date_time = now();
            $appointment->status = 1;
            $appointment->updated_by = Auth::user()->name;
            $appointment->save();

            return response()->json(['data' => $appointment]);
        }
    }

    public function cancelled($id)
    {
        $appointment = Appointment::where('id', $id)->first();
        if ($appointment) {
            $appointment->status = 2;
            $appointment->updated_by = Auth::user()->name;
            $appointment->save();

            return response()->json(['data' => $appointment]);
        }
    }

    public function delete($id)
    {
        $appointment = Appointment::where('id', $id)->first();
        if ($appointment) {
            $appointment->delete();
            return response()->json(201);
        }
    }

    private function event($appointment)
    {
        $add1_hour_to_start_time = date('Y-m-d H:i:s', strtotime($appointment['date'] . $appointment['time'] . ' +1 hour'));
        $event = [
            'id' => $appointment['id'],
            'start' => date('Y-m-d H:i:s', strtotime($appointment['date'] . $appointment['time'])),
            'end' => $add1_hour_to_start_time,
            'title' => $appointment['patient']['title'] . ' ' .
                $appointment['patient']['first_name'] . ' ' .
                $appointment['patient']['last_name'] .
                ' ( ' . $appointment['service']['name'] . ' ) ',

            // 'service_name' => $appointment['service']['name'] . ' with ' . $appointment['user']['name'],
            // 'customer_phone' => $event['customer']['phone'],
            // 'customer_name' => $event['customer']['name'],
            'backgroundColor' => $appointment['user']['color'],
            'status' => $appointment['status']
        ];
        return $event;
    }
}
