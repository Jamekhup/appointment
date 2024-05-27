<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ServiceController extends Controller
{
    public function index()
    {
        $services = Service::orderBy('created_at', 'desc')->get();
        return response()->json(['services' => $services]);
    }

    public function create(Request $request)
    {

        $input = Validator::make($request->all(), [
            'name' => 'required|max:150',
            'price' => 'required',
            'homeVisitPrice' => 'required'
        ]);

        if ($input->fails()) {
            return response()->json(['status' => 'fail', 'message' => $input->errors()], 422);
        }

        $service = new Service();
        $service->name = $request->name;
        $service->price = $request->price;
        $service->home_visit_price = $request->homeVisitPrice;
        $service->description = $request->description;
        $service->created_by = Auth::user()->name;

        if ($service->save()) {
            return response()->json([
                'status' => 'success',
                'data' => $service
            ]);
        } else {
            return response()->json(['status' => 'fail', 'message' => 'Something went wrong'], 422);
        }
    }
    public function update(Request $request, $id)
    {

        $input = Validator::make($request->all(), [
            'name' => 'required|max:150',
            'price' => 'required',
            'homeVisitPrice' => 'required'
        ]);

        if ($input->fails()) {
            return response()->json(['status' => 'fail', 'message' => $input->errors()], 422);
        }

        $service = Service::where('id', $id)->first();
        if ($service) {
            $service->name = $request->name;
            $service->price = $request->price;
            $service->home_visit_price = $request->homeVisitPrice;
            $service->description = $request->description;
            $service->updated_by = Auth::user()->name;
            if ($service->save()) {
                return response()->json([
                    'status' => 'success',
                    'data' => $service
                ]);
            } else {
                return response()->json(['status' => 'fail', 'message' => 'Something went wrong'], 422);
            }
        }
    }

    public function delete($id)
    {
        $employee = Service::where('id', $id)->first();
        if ($employee) {
            $employee->delete();
            return response()->json(201);
        }
    }
}
