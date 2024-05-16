<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\ReserveAppointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ReservationController extends Controller
{
    public function index()
    {
    }

    public function create(Request $request)
    {
        $input = Validator::make($request->all(), [
            'date' => 'required',
            'fromTime' => 'required',
            'toTime' => 'required',
        ]);

        if ($input->fails()) {
            return response()->json(['status' => 'fail', 'message' => $input->errors()], 422);
        }

        $reserved = ReserveAppointment::where('date', date('Y-m-d', strtotime($request->date)))
            ->where('from_time', '<=', date('H:i:s', strtotime($request->fromTime)))
            ->where('to_time', '>=', date('H:i:s', strtotime($request->toTime)))
            ->first();

        if ($reserved) {
            return response()->json([
                'status' => 'reserved',
                'message' => 'Already Reserved'
            ]);
        } else {
            $reserve = new ReserveAppointment();
            $reserve->date = $request->date;
            $reserve->from_time = $request->fromTime;
            $reserve->to_time = $request->toTime;
            $reserve->created_by = Auth::user()->name;

            if ($reserve->save()) {
                $event = $this->event($reserve);
                return response()->json(['status' => 'success', 'data' => $event]);
            }
            return response()->json(['status' => 'fail', 'message' => 'Something went wrong'], 422);
        }
    }

    public function delete($id)
    {
        if (Auth::user()->appointment_access == 1) {
            $reserved = ReserveAppointment::where('id', $id)->first();
            if ($reserved) {
                $reserved->delete();
                return response()->json($id);
            }
        }
        abort(403);
    }
    private function event($reserved)
    {
        $event = [
            'id' => $reserved['id'],
            'start' => date('Y-m-d H:i:s', strtotime($reserved['date'] . $reserved['from_time'])),
            'end' => date('Y-m-d H:i:s', strtotime($reserved['date'] . $reserved['to_time'])),
            'title' => "Reserved",
            'backgroundColor' => "red",
        ];
        return $event;
    }
}
