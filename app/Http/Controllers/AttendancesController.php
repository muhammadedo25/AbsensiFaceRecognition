<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\attendance;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;

class AttendancesController extends Controller
{
    static function isTodayAttadanceSubmitted():bool
    {
        if (Auth::guest()) {
            return false;
        }
        return attendance::where('user_id' , Auth::user()->id)
        ->whereDate('created_at', now() -> ToDateString())
        ->exists();
    }


    public function submit(Request $request)
    {
        $request -> validate([
            'status' => 'required',
            'description' => 'required_if:status,sick,leave,permit,trusiness_trip,remote||max:500',
            'latitude' => 'required',
            'longitude' => 'required',
            'address' => 'required'
        ]);

        Attendance::Create([
            'user_id' => Auth::user()->id,
            'status' => $request->status,
            'description' => $request->description,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'address' => $request->address
        ]);
        
        return redirect::route('dashboard');
    }
    
}
