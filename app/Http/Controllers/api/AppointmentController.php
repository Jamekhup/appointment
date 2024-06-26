<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Patient;
use App\Models\ReserveAppointment;
use App\Models\User;
use Carbon\Carbon;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class AppointmentController extends Controller
{
    public function index()
    {
        $appointments = Appointment::with('patient', 'user', 'service')->where('status', 0)->get();
        $reserved = ReserveAppointment::all();
        $resources = $appointments->pluck('user')->unique('id');

        $events = [];
        foreach ($appointments as $appointment) {
            $events[] = [
                'id' => $appointment['id'],
                'start' => date('Y-m-d H:i:s', strtotime($appointment['date'] . $appointment['from_time'])),
                'end' => date('Y-m-d H:i:s', strtotime($appointment['date'] . $appointment['to_time'])),
                'isDraggable' => true,
                'resourceId' => $appointment->user->id,
                'title' => $appointment['patient']['title'] . ' ' . $appointment['patient']['first_name'] . ' ' . $appointment['patient']['last_name'],
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
                'isDraggable' => false,
                'resourceId' => 1,
                'title' => "Reserved",
                'backgroundColor' => "red",
            ];
        }

        $formattedResources = [];
        foreach ($resources as $resource) {
            $formattedResources[] = [
                'id' => $resource['id'],
                'title' => $resource['name'],
            ];
        }

        return response()->json(['events' => $events, 'resources' => $formattedResources]);
    }

    public function appointmentList(Request $request)
    {
        if (Auth::user()->appointment_list_access == 1) {
            $appointments = Appointment::with('user', 'patient', 'service')->when($request->dateRange, function ($query, $date) {
                $query->whereDate('date', '>=', Carbon::parse($date[0])->addDay()->format('Y-m-d'))
                    ->whereDate('date', '<=', Carbon::parse($date[1])->addDay()->format('Y-m-d'));
            })
                ->when($request->search, function ($query, $search) {
                    $query->whereHas('patient', function ($query) use ($search) {
                        $query->where('first_name', 'LIKE', '%' . $search . '%')
                            ->orWhere('last_name', 'LIKE', '%' . $search . '%');
                    })
                        ->orWhereHas('user', function ($query) use ($search) {
                            $query->where('name', 'LIKE', '%' . $search . '%');
                        });
                })
                ->orderBy('created_at', 'DESC')->paginate(30);

            $therapists = User::where('role', 2)->get();

            return response()->json(['appointments' => $appointments, 'therapists' => $therapists]);
        }
        abort(403);
    }

    public function create(Request $request)
    {
        $input = Validator::make($request->all(), [
            'serviceId' => 'required',
            // 'patientId' => '',
            'date' => 'required',
            'fromTime' => 'required',
            'toTime' => 'required',
            'times' => 'required',
        ]);

        if ($input->fails()) {
            return response()->json(['status' => 'fail', 'message' => $input->errors()], 422);
        }

        $reserved = ReserveAppointment::where('date', '=', date('Y-m-d', strtotime($request->date)))
            ->where('from_time', '<=', date("H:i:s", strtotime($request->fromTime)))
            ->where('to_time', '>=', date("H:i:s", strtotime($request->toTime)))
            ->first();

        if ($reserved) {
            return response()->json([
                'status' => 'reserved',
                'message' => $request->date . " from " . date('H:i', strtotime($request->fromTime)) . " to " . date('H:i', strtotime($request->toTime)) . ' Reserved'
            ]);
        } else {
            $already_reserved = Appointment::with('user')->where('user_id', $request->therapistId)
                ->where('date', '=', date('Y-m-d', strtotime($request->date)))
                ->where('from_time', '>=', date('H:i:s', strtotime($request->fromTime)))
                ->where('to_time', '<=', date('H:i:s', strtotime($request->toTime)))
                ->where('status', '=', 0)
                ->first();

            if ($already_reserved) {
                return response()->json([
                    'status' => 'reserved',
                    'message' => $already_reserved->user->name .  ' is not available at ' . $request->date . " from " . date('H:i:s', strtotime($request->fromTime)) . " to " . date('H:i:s', strtotime($request->fromTime))
                ]);
            } else {
                try {
                    DB::beginTransaction();

                    if ($request->patientId) {
                        $patient_id = $request->patientId;
                    } else {
                        $patient = new Patient();
                        $patient->title = $request->title;
                        $patient->first_name = $request->firstName;
                        $patient->last_name = $request->lastName;
                        $patient->dob = $request->dob;
                        $patient->email = $request->email;
                        $patient->phone = $request->phone;
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
                            $patient_id = $patient->id;
                        }
                    }

                    if ($request->times == 1) {
                        $appointment = new Appointment();
                        $appointment->patient_id = $patient_id;
                        $appointment->service_id = $request->serviceId;
                        if (Auth::user()->role == 0 || Auth::user()->role == 1) {
                            $appointment->user_id = $request->therapistId;
                        } else {
                            $appointment->user_id = Auth::user()->id;
                        }
                        $appointment->doctor_name = $request->doctor;
                        $appointment->date = $request->date;
                        $appointment->from_time = $request->fromTime;
                        $appointment->to_time = $request->toTime;
                        $appointment->times = 1;
                        $appointment->comment = $request->comment;
                        $appointment->created_by = Auth::user()->name;
                        $appointment->save();
                    }


                    //if times is more than 1 time
                    if ($request->times > 1) {
                        for ($int = 0; $int < $request->times; $int++) {
                            $appointment = new Appointment();
                            $appointment->patient_id = $patient_id;
                            $appointment->service_id = $request->serviceId;
                            if (Auth::user()->role == 0 || Auth::user()->role == 1) {
                                $appointment->user_id = $request->therapistId;
                            } else {
                                $appointment->user_id = Auth::user()->id;
                            }
                            $appointment->doctor_name = $request->doctor;
                            if ($int == 0) {
                                $appointment->date = $request->date;
                            } else {
                                $appointment->date = Carbon::parse($request->date)->addDays($int * 7);
                            }
                            $appointment->from_time = $request->fromTime;
                            $appointment->to_time = $request->toTime;
                            $appointment->times = $request->times - $int;
                            $appointment->comment = $request->comment;
                            $appointment->created_by = Auth::user()->name;
                            $appointment->save();
                        }
                    }

                    DB::commit();

                    return response()->json(['status' => 'success', 'message' => 'Appointment created successfully']);
                } catch (\Throwable $th) {
                    DB::rollBack();
                    //throw $th;
                    return response()->json(['status' => 'fail', 'message' => $th->getMessage()], 422);
                }
            }
        }
    }

    public function update(Request $request, $id)
    {
        if (Auth::user()->appointment_list_access == 1) {
            $input = Validator::make($request->all(), [
                'serviceId' => 'required',
                'patientId' => 'required',
                'date' => 'required',
                'fromTime' => 'required',
                'toTime' => 'required',
                'status' => 'required',
            ]);

            if ($input->fails()) {
                return response()->json(['status' => 'fail', 'message' => $input->errors()], 422);
            }

            $reserved = ReserveAppointment::where('date', date('Y-m-d', strtotime($request->date)))
                ->where('from_time', '>=', date('H:i:s', strtotime($request->formTime)))
                ->where('to_time', '<=', date('H:i:s', strtotime($request->toTime)))
                ->first();

            if ($reserved) {
                return response()->json([
                    'status' => 'reserved',
                    'message' => date('Y-m-d', strtotime($request->date)) . " " . date('H:i:s', strtotime($request->fromTime)) . ' Reserved'
                ]);
            } else {
                $appointment = Appointment::with('patient', 'user', 'service')->where('id', $id)->first();
                if ($appointment) {
                    $appointment->patient_id = $request->patientId;
                    $appointment->service_id = $request->serviceId;
                    $appointment->user_id = $request->therapistId;
                    $appointment->doctor_name = $request->doctor;
                    $appointment->date = $request->date;
                    $appointment->from_time = $request->fromTime;
                    $appointment->to_time = $request->toTime;
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
        abort(403);
    }

    public function detail($id)
    {
        if (Auth::user()->appointment_list_access == 1) {
            $appointment = Appointment::with('user', 'service', 'patient')->where('id', $id)->first();
            if ($appointment) {
                return response()->json(['status' => 'success', 'data' => $appointment]);
            }
        }
        abort(403);
    }

    public function finished($id)
    {
        if (Auth::user()->appointment_access == 1) {
            $appointment = Appointment::where('id', $id)->first();
            if ($appointment) {
                $appointment->finish_date_time = now();
                $appointment->status = 1;
                $appointment->updated_by = Auth::user()->name;
                $appointment->save();

                return response()->json(['data' => $appointment]);
            }
        }
        abort(403);
    }

    public function cancelled($id)
    {
        if (Auth::user()->appointment_access == 1) {
            $appointment = Appointment::where('id', $id)->first();
            if ($appointment) {
                $appointment->status = 2;
                $appointment->updated_by = Auth::user()->name;
                $appointment->save();

                return response()->json(['data' => $appointment]);
            }
        }
        abort(403);
    }

    public function dnd(Request $request, $id)
    {
        if (Auth::user()->appointment_access == 1) {
            $reserved = ReserveAppointment::whereDate('date', $request->startDate)
                ->whereTime('from_time', '<=', $request->start)
                ->whereTime('to_time', '>=', $request->end)
                ->first();
            if ($reserved) {
                return response()->json(['status' => 'reserved', 'data' => 'reserved']);
            } else {
                $appointment = Appointment::where('id', $id)->first();
                if ($appointment) {
                    $appointment->date = new DateTime($request->startDate);
                    $appointment->from_time = $request->start;
                    $appointment->to_time = $request->end;
                    $appointment->updated_by = Auth::user()->name;
                    $appointment->save();

                    return response()->json(201);
                }
            }
        }
        abort(403);
    }
    public function delete($id)
    {
        if (Auth::user()->appointment_list_access == 1) {
            $appointment = Appointment::where('id', $id)->first();
            if ($appointment) {
                $appointment->delete();
                return response()->json(201);
            }
        }
        abort(403);
    }
}
