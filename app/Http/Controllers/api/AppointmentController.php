<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\ReserveAppointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AppointmentController extends Controller
{
    public function index()
    {
        $appointments = Appointment::with('patient', 'user')->get();
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
                'status' => $appointment['status']
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
        $appointments = Appointment::all();
        return response()->json(['appointments' => $appointments]);
    }

    public function create(Request $request)
    {
        $input = Validator::make($request->all(), [
            'serviceId' => 'required',
            'patientId' => 'required',
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
            $appointment = new Appointment();
            $appointment->service_id = $request->serviceId;
            $appointment->patient_id = $request->patientId;
            $appointment->user_id = Auth::user()->id;
            $appointment->doctor_name = $request->doctor;
            $appointment->date = $request->date;
            $appointment->time = $request->time;
            // $appointment->status = $request->service_id;
            $appointment->comment = $request->comment;
            // $appointment->start_date_time = $request->service_id;
            // $appointment->finish_date_time = $request->service_id;
            $appointment->created_by = Auth::user()->name;
            // $appointment->updated_by = $request->service_id;
            if ($appointment->save()) {
                $get_appointment = Appointment::with('patient', 'user')->find($appointment->id);
                $event = $this->event($get_appointment);
                return response()->json(['status' => 'success', 'data' => $event]);
            }
            return response()->json(['status' => 'fail', 'message' => 'Something went wrong'], 422);
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
