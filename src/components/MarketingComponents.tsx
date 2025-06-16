import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Clock, Zap, Upload, Cake, Smile, Mail, ArrowRight } from "lucide-react";

import graph from "../assets/graph2.png";
import { useState } from "react";
import SendOverlay from "./SendOverlay";

export default function MarketingComponents() {
  const [openSendOverlay, setOpenSendOverlay] = useState(false);

  return (
    <>
    <div className="flex flex-col gap-6">
      {/* Top Summary Section */}
      <div className="flex flex-row gap-6">
        <div className="flex flex-col bg-white justify-between shadow-md rounded-2xl p-8 w-full">
          {/* Header */}
          <div className="flex flex-row items-center justify-between p-2">
            <div className="p-2">
              <h2 className="text-xl font-semibold">Summary</h2>
              <p className="text-sm text-muted-foreground">Ready to go!</p>
            </div>
            <Button size="sm" variant="outline">
              <Upload size={18} />
              Button
            </Button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            {[
              { title: "Total Emails", value: "1531", button: "Buy Emails" },
              { title: "Total Customer", value: "5000", button: "Send" },
              { title: "Open Rates", value: "89.23%", button: "Statistics" },
            ].map((item, idx) => (
              <Card key={idx}>
                <CardHeader className="flex flex-col gap-2 items-center">
                  <CardTitle className="font-bold text-gray-400">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="text-xl text-black font-semibold">
                    {item.value}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-10 justify-center items-center">
                  <img src={graph} alt="graph" />
                  <Button variant="outline" size="sm">
                    {item.button}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Side Cards */}
        <div className="flex flex-row gap-3 w-1/2">
          <Card className="flex flex-col text-center justify-around">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                Schedule mails and reach
                <br /> out to your customers while sleeping
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-2">
              <Button variant="outline" size="lg">
                Schedule <Clock className="ml-1 h-4 w-4" />
              </Button>
              <p className="text-xs text-muted-foreground">
                Upcoming event on 16 May
              </p>
            </CardContent>
          </Card>

          <Card className="flex flex-col text-center justify-around">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                Our mails will be strategically
                <br />
                sent based on real-time data
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-2">
              <Button variant="premium" size="lg" onClick={()=>{setOpenSendOverlay(true)}}>
                Send <Zap className="ml-1 h-8 w-8" />
              </Button>
              <p className="text-xs text-muted-foreground">
                Last sent on 15 Mar
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {/* Campaigns */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Campaigns</CardTitle>
            <Button variant="link" size="sm" className="text-sm">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4 px-6 pb-6">
            {[
              { icon: <Cake />, name: "Happy Birthday" },
              { icon: <Smile />, name: "Miss you :)" },
              { icon: <Mail />, name: "Welcome Series" },
              { icon: <Mail />, name: "Welcome Series" },
              { icon: <Mail />, name: "Welcome Series" },
            ].map((campaign, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-full">
                    {campaign.icon}
                  </div>
                  <span className="text-sm">{campaign.name}</span>
                </div>
                <Switch />
              </div>
            ))}
            <div className="pt-4">
              <Button variant="outline" size="sm" className="w-full">
                Add Campaigns
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Templates */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Your Templates</CardTitle>
            <Button variant="link" size="sm" className="text-sm">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4 px-6 pb-6">
            {[
              { name: "Happy Birthday", time: "01:00 PM – 02:00 PM" },
              { name: "Wednesday Template", time: "02:00 PM – 03:00 PM" },
              { name: "Weekend", time: "03:00 PM – 04:00 PM" },
              { name: "Weekend", time: "03:00 PM – 04:00 PM" },
              { name: "Weekend", time: "03:00 PM – 04:00 PM" },
            ].map((template, index) => (
              <div
                key={index}
                className="border-l-2 border-indigo-500 pl-3"
              >
                <p className="text-sm font-medium">{template.name}</p>
                <p className="text-xs text-muted-foreground">
                  {template.time}
                </p>
              </div>
            ))}
            <div className="pt-4">
              <Button variant="outline" size="sm" className="w-full">
                Request Template
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Campaign Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Campaign Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-6 pb-6">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium">New Customer Campaign</p>
                  <p className="text-xs text-muted-foreground">
                    Today, 16:36
                  </p>
                </div>
                <Button variant="redeem" size="sm">
                  Active
                </Button>
              </div>
            ))}
            <div className="pt-4">
              <Button variant="link" size="sm" className="text-sm">
                View full Activity <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
     <SendOverlay open={openSendOverlay} onClose={() => setOpenSendOverlay(false)} />
    </>
  );
}
