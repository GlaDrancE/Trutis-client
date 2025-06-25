import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Custom slider styles
const sliderStyles = `
  .slider-purple::-webkit-slider-thumb {
    appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #8b5cf6;
    cursor: pointer;
    border: 2px solid #ffffff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
  
  .slider-purple::-moz-range-thumb {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #8b5cf6;
    cursor: pointer;
    border: 2px solid #ffffff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
`;

export default function SendOverlay({
  open,
  onClose,
  handleSend,
  handleChange,
  templates
}: {
  open: boolean;
  onClose: () => void;
  handleSend: (type?: string) => void;
  handleChange: (field: string, value: any) => void;
  templates: any[];
}) {
  const [discount, setDiscount] = useState(10);

  // Calendar state
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  const todayDate = new Date();

  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const daysOfWeek = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  const handleDiscountChange = (value: number) => {
    setDiscount(value);
    handleChange('discount', value);
  };

  const handleDateSelect = (day: number) => {
    setSelectedDate(day);
    const selectedDateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    handleChange('date', selectedDateStr);
  };

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentYear, currentMonth + direction, 1);
    setCurrentMonth(newDate.getMonth());
    setCurrentYear(newDate.getFullYear());
    setSelectedDate(null); // Reset selected date when changing months
  };

  // Generate calendar days for the current month
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    const firstDay = new Date(year, month, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1; // Convert Sunday (0) to be last (6)
  };

  const isDateDisabled = (day: number) => {
    const date = new Date(currentYear, currentMonth, day + 1);
    return date < todayDate;
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isDisabled = isDateDisabled(day);
      const isSelected = selectedDate === day;

      days.push(
        <button
          key={day}
          onClick={() => !isDisabled && handleDateSelect(day)}
          disabled={isDisabled}
          className={`w-8 h-8 text-sm rounded-full flex items-center justify-center transition-colors ${isSelected
            ? "bg-blue-500 text-white"
            : isDisabled
              ? "text-gray-300 cursor-not-allowed"
              : "hover:bg-gray-100 text-gray-700 cursor-pointer"
            }`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <>
      <style>{sliderStyles}</style>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="p-0 rounded-2xl max-w-4xl border-0 shadow-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-4">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-xl font-semibold">Send Campaign</DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Date */}
                <div>
                  <Label className="text-sm font-medium text-gray-600 mb-2 block">Date</Label>
                  <Card className="shadow-lg">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-lg">{months[currentMonth]} {currentYear}</h3>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => navigateMonth(-1)}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => navigateMonth(1)}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {daysOfWeek.map(day => (
                          <div key={day} className="text-xs text-gray-500 text-center p-1 font-medium">
                            {day}
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-7 gap-1">
                        {renderCalendar()}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Template */}
                <div>
                  <Label className="text-sm font-medium text-gray-600 mb-2 block">Template</Label>
                  <Card className="shadow-lg">
                    <CardContent className="md:p-3">
                      <select
                        className="w-full bg-transparent border-0 outline-none text-sm font-medium text-purple-600"
                        onChange={(e) => handleChange('template', e.target.value)}
                        defaultValue={templates[0]?.id}

                      >
                        {templates.map((template) => (
                          <option key={template.id} value={template.id}>
                            {template.template_name.charAt(0).toUpperCase() + template.template_name.slice(1)}
                          </option>
                        ))}
                      </select>
                    </CardContent>
                  </Card>
                </div>

                {/* Emails Count */}
                {/* <div>
                  <Label className="text-sm font-medium text-gray-600 mb-2 block">Emails Count:</Label>
                  <Card className="shadow-lg">
                    <CardContent className="p-3">
                      <input
                        type="number"
                        min={1}
                        defaultValue={500}
                        className="w-full bg-transparent border-0 outline-none text-lg font-semibold text-center"
                        onChange={(e) => handleChange('emailsCount', Number(e.target.value))}
                      />
                    </CardContent>
                  </Card>
                </div> */}
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Discount Rate */}
                <div>
                  <Label className="text-sm font-medium text-gray-600 mb-2 block">Discount Rate %</Label>
                  <Card className="shadow-lg">
                    <CardContent className="md:p-3">
                      <div className="space-y-3">
                        <div className="text-center">
                          <span className="text-2xl font-bold text-purple-600">{discount}%</span>
                        </div>
                        <input
                          type="range"
                          min="5"
                          max="15"
                          value={discount}
                          onChange={(e) => handleDiscountChange(Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-purple"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>5</span>
                          <span>10</span>
                          <span>15</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Discount Validity */}
                <div>
                  <Label className="text-sm font-medium text-gray-600 mb-2 block">Discount Validity</Label>
                  <Card className="shadow-lg">
                    <CardContent className="p-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs text-gray-500 mb-1 block">From</Label>
                          <input
                            type="date"
                            min={today}
                            className="w-full bg-transparent border-0 border-b border-gray-300 outline-none text-sm pb-1"
                            onChange={(e) => handleChange('validityStart', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500 mb-1 block">To</Label>
                          <input
                            type="date"
                            min={today}
                            className="w-full bg-transparent border-0 border-b border-gray-300 outline-none text-sm pb-1"
                            onChange={(e) => handleChange('validityEnd', e.target.value)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Customer Type */}
                <div>
                  <Label className="text-sm font-medium text-gray-600 mb-2 block">Customer Type</Label>
                  <Card className="shadow-lg">
                    <CardContent className="md:p-3">
                      <select
                        className="w-full bg-transparent border-0 outline-none text-sm font-medium"
                        defaultValue={"To All"}
                        onChange={(e) => handleChange('customerType', e.target.value)}
                      >
                        <option value={"To All"}>To All</option>
                        <option value={"New"}>New</option>
                        <option value={"Loyal"}>Loyal</option>
                      </select>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            <DialogFooter className="flex justify-between pt-4 mt-4 border-t">
              <Button variant="outline" onClick={onClose} className="px-6">
                Reject
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" className="px-4 border-purple-200 text-purple-600 hover:bg-purple-50" onClick={() => handleSend("smart")}>
                  Smart Send
                </Button>
                <Button onClick={() => handleSend()} className="px-4 bg-purple-600 hover:bg-purple-700">
                  Confirm Send
                </Button>
              </div>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
