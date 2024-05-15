<?php

namespace App\Exports;

use App\Models\PaymentRecord;
use Carbon\Carbon;
use DateTime;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithCustomStartCell;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Events\AfterSheet;

class PaymentRecordExport implements FromCollection,
WithHeadings,
WithEvents,
ShouldAutoSize,
WithCustomStartCell
{

    protected $from;
    protected $to;

    public function __construct($from, $to)
    {
        $this->from = $from;
        $this->to = $to;
    }

    public function headings(): array
    {
        return [
            'no',
            'patient_name',
            'Date of Birth',
            'Address',
            'Insurance Company',
            'House Doctor',
            'Recommended Doctor',
            'Payment Free',
            'Treatment in Six months',
            'Private Patient',
            'Issue Date',
            'Treatment',
            'Doctor Name',
            'Covered By Insurance Company',
            'Number',
            'Cost',
            'Additional Payment',
            'Home Visit',
            'Number2',
            'Cost3',
            'Additional Payment 4' ,
            'Total Payment',
            'Received By',
            'Received Date',
            'Remark',
            'Created By',
            'Last Updated By'
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $event->sheet->mergeCells('A1:X1');
                $event->sheet->setCellValue('A1', $this->title());
            },
        ];
    }


    public function startCell(): string
    {
        return 'A2';
    }

    public function title()
    {
        return "Payment Record - From " . Carbon::parse($this->from)->addDay()->format('Y-m-d') . " to " . Carbon::parse($this->to)->addDay()->format('Y-m-d');
    }
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        $payment = PaymentRecord::with('patient')->when($this->from && $this->to, function ($query) {
            $query->whereDate('issue_date', '>=', Carbon::parse($this->from)->addDay()->format('Y-m-d'))
                ->whereDate('issue_date', '<=', Carbon::parse($this->to)->addDay()->format('Y-m-d'));
        })->orderBy('created_at', 'DESC')->get();

        $result = [];


        foreach ($payment  as $key => $td) {

            array_push($result, [
                'no' => $key + 1,
                'patient_name' => $td->patient->title . ' ' . $td->patient->first_name . ' ' . $td->patient->last_name,
                'date_of_birth' => $td->patient->dob,
                'address' => $td->patient->house_number . ', ' . $td->patient->street . ', ' . $td->patient->city . ', ' . $td->patient->postal_code,
                'insurance_company' => $td->patient->health_insurance_company,
                'house_doctor' => $td->patient->house_doctor,
                'recommended_doctor' => $td->patient->recommended_doctor,
                'payment_free' => $td->patient->payment_free == 1 ? 'Yes' : 'No',
                'treatment_in_six_months' => $td->patient->treatment_in_6_month == 1 ? 'Yes' : 'No',
                'private_patient' => $td->patient->private_patient == 1 ? 'Yes' : 'No',
                'issue_date' => $td->issue_date,
                'treatment' => $td->treatment,
                'doctor_name' => $td->doctor_name,
                'covered_by_insurance_company' => $td->full_covered_by_insurance_company == 1 ? 'Yes' : 'No',
                'number' => $td->number,
                'cost' => '€ ' .$td->cost,
                'additional_payment' => $td->additional_payment ?  '€ '. $td->additional_payment : '-',
                'home_visit' => $td->home_visit == 1? 'Yes' : 'No',
                'number2' => $td->number2,
                'cost3' => '€ '. $td->cost3,
                'additional_payment_4' => $td->additional_payment_4 ? '€ '. $td->additional_payment_4 : '-',
                'total_payment' => '€ '. $td->total_payment,
                'received_by' => $td->received_by,
                'received_date' => $td->received_date,
                'remark' => $td->remark,
                'created_by' => $td->created_by,
                'last_updated_by' => $td->updated_by ? $td->updated_by : '-'
            ]);
        }

        $collection = collect($result);
        return $collection;
    }
}
