<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class CheckPerformanceController extends Controller
{
    function index(Request $req) {
        $response = Http::timeout(60)->get('https://www.googleapis.com/pagespeedonline/v5/runPagespeed', [
            'url' => $req->url,
            'strategy' => $req->platform,
            'category' => 'performance',
        ]);
        
        $jsonResponse = $response->json();
        // return $jsonResponse;
        $score = $jsonResponse["lighthouseResult"]["categories"]["performance"]["score"];
        return response()->json(["status" => true, "score" => $score]);
    }
}
