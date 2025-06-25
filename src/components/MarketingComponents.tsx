import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Clock, Zap, Upload, Cake, Smile, Mail, ArrowRight, Info } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useRef, useState, useEffect } from "react";
import SendOverlay from "./SendOverlay";
import useClient from "@/hooks/client-hook";
import { sendMarketingMails, setCampaignStatus } from "../../services/api";
import { useCustomerStore } from "@/store/slices/customerStore";
import { useParams } from "react-router-dom";
import { CustomerData } from "types";
import { useCredit } from "@/context/credit-context";
import EmailTemplateEditor from "./EmailTemplateEditor";
import type { EmailTemplateEditorRef } from "./EmailTemplateEditor";
import graph from "../assets/graph2.png";
import toast from "react-hot-toast";

export default function MarketingComponents({ templates, handleTemplates, marketingHistory, handleMarketingHistory, campaigns, handleFetchCampaigns, setCampaigns }: { templates: any[], handleTemplates: () => void, marketingHistory: any[], handleMarketingHistory: () => void, campaigns: any[], handleFetchCampaigns: () => void, setCampaigns: (campaigns: any[]) => void }) {
  // const { credits } = useCredit();
  const { client } = useClient()
  const customerStore = useCustomerStore();
  const { id } = useParams();

  const [openSendOverlay, setOpenSendOverlay] = useState(false);
  const [message, setMessage] = useState<string>("Hello");
  const [title, setTitle] = useState<string>("Hello");
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<number>(1);
  const [creditAvailable, setCreditAvailable] = useState<number>(100);
  const [creditRequired, setCreditRequired] = useState<number>(0);
  const [sendType, setSendType] = useState<string>("bulk");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [isImmediate, setIsImmediate] = useState<boolean>(false);
  const [couponCode, setCouponCode] = useState<string>("");
  const [couponStart, setCouponStart] = useState<string>("");
  const [couponEnd, setCouponEnd] = useState<string>("");
  const [couponDiscount, setCouponDiscount] = useState<number>(100);
  const [couponType, setCouponType] = useState<string>("percentage");
  const [minOrderValue, setMinOrderValue] = useState<number>(100);
  const [newCustomers, setNewCustomers] = useState<CustomerData[]>([]);
  const [oldCustomers, setOldCustomers] = useState<CustomerData[]>([]);

  // Email template dialog states
  const [openTemplateDialog, setOpenTemplateDialog] = useState<boolean>(false);
  const [confirmCloseDialog, setConfirmCloseDialog] = useState<boolean>(false);
  const [openTemplateInfoDialog, setOpenTemplateInfoDialog] = useState<boolean>(false);

  // Template details
  const [templateTitle, setTemplateTitle] = useState<string>("");
  const [templateName, setTemplateName] = useState<string>("");
  const [templateCategory, setTemplateCategory] = useState<string>("General");

  // ref to access email editor methods
  const emailEditorHandle = useRef<EmailTemplateEditorRef | null>(null);

  const handleChange = (field: string, value: any) => {
    switch (field) {
      case 'date':
        setStartDate(value);
        setEndDate(value);
        break;
      case 'discount':
        setCouponDiscount(value);
        break;
      case 'validityStart':
        setCouponStart(value);
        break;
      case 'validityEnd':
        setCouponEnd(value);
        break;
      case 'emailsCount':
        setCreditRequired(value);
        break;
      case 'template':
        setTitle(templates.find(template => template.id === value)?.title)
        setMessage(templates.find(template => template.id === value)?.content)
        setSendType(templates.find(template => template.id === value)?.category)
        break;
      case 'customerType':
        // Update selectedEmails based on customer type
        if (value === 'New') {
          setSelectedEmails(newCustomers.map(customer => customer.email));
        } else if (value === 'Loyal') {
          setSelectedEmails(oldCustomers.map(customer => customer.email));
        } else {
          // To All
          setSelectedEmails([...oldCustomers, ...newCustomers].map(customer => customer.email));
        }
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    if (selectedEmails.length > 0) {
      setCreditRequired(selectedEmails.length / 100)
    }
  }, [selectedEmails])


  useEffect(() => {
    if (id) {
      customerStore.loadCustomers(id)
      handleTemplates()
    }
  }, [id])
  useEffect(() => {
    setNewCustomers(customerStore.customers.filter(customer => customer.isLoyalCustomer === false))
    setOldCustomers(customerStore.customers.filter(customer => customer.isLoyalCustomer === true))
    setSelectedEmails(customerStore.customers.map(customer => customer.email))
  }, [customerStore.customers])


  const handleSend = async (type?: string) => {
    try {
      if (!client?.id) return
      const response = await sendMarketingMails({
        client_id: client?.id,
        message: message,
        title: title,
        emails: selectedEmails,
        type: type || 'bulk',
        selected_days: selectedDays,
        credit_available: creditAvailable,
        credit_required: creditRequired,
        send_type: sendType,
        start_date: startDate,
        end_date: endDate,
        is_immediate: isImmediate,
        coupon_code: couponCode,
        coupon_start: couponStart,
        coupon_end: couponEnd,
        coupon_discount: couponDiscount,
        coupon_type: couponType,
        min_order_value: minOrderValue
      })
      console.log(response.data)
      setOpenSendOverlay(false)
      handleMarketingHistory();
      customerStore.loadCustomers(id || '');
      toast.success('Marketing mails sent successfully');
    } catch (error) {
      console.log(error)
    }
  }

  const handleSetCampaign = async (e: any, id: string) => {
    console.log(!e)
    try {
      await setCampaignStatus({
        client_id: client?.id || '',
        campaign_id: id,
        status: !e
      })
      setCampaigns(campaigns.map((campaign) => campaign.id === id ? { ...campaign, enabled: !e } : campaign))
      handleFetchCampaigns()
    } catch (error) {
      toast.error("Something went wrong changing the campaign status")
    }
  }

  // Handle export from editor -> send to backend

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
                { title: "Total Emails", value: marketingHistory.reduce((sum, item) => sum + item.batch.length, 0), button: "Buy Emails" },
                { title: "Total Customer", value: customerStore.customers.length, button: "Send" },
                { title: "Email this month", value: marketingHistory.filter((item: any) => new Date(item.createdAt).getMonth() === new Date().getMonth() && new Date(item.createdAt).getFullYear() === new Date().getFullYear()).reduce((sum: number, item: any) => sum + item.batch.length, 0), button: "Statistics" },
              ].map((item, idx) => (
                <Card key={idx}>
                  <CardHeader className="flex flex-col gap-2 items-center">
                    <CardTitle className="font-bold text-gray-400 text-center">
                      {item.title}
                    </CardTitle>
                    <CardDescription className="text-xl text-black font-semibold">
                      {item.value}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-10 justify-center items-center">
                    {/* <img src={graph} alt="graph" /> */}
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
                <Button variant="premium" size="lg" onClick={() => { setOpenSendOverlay(true) }}>
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
              {campaigns.length <= 0 && <div className="text-sm text-muted-foreground h-full flex items-center justify-center">No campaigns found</div>}
              {campaigns.map((campaign, index) => {
                const enabled = campaign.ClientCampaignsPref[0] ? campaign.ClientCampaignsPref[0].enabled : false
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* <div className="p-2 bg-gray-100 rounded-full">
                      {campaign.name.charAt(0).toUpperCase() + campaign.name.slice(1)}
                    </div> */}
                      <span className="text-sm">{campaign.name.charAt(0).toUpperCase() + campaign.name.slice(1)}</span>
                    </div>
                    <Switch onCheckedChange={(e) => (handleSetCampaign(enabled, campaign.id))} checked={enabled} />
                  </div>
                )
              })}
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
            <CardContent className="space-y-4 px-6 pb-6 h-96 overflow-y-auto">
              {templates.length > 0 ?
                templates.map((template, index) => (
                  template.category.toLowerCase() !== "campaign" && (
                    <div
                      key={index}
                      className="border-l-2 border-indigo-500 pl-3"
                    >
                      <p className="text-sm font-medium">{template.template_name.charAt(0).toUpperCase() + template.template_name.slice(1)}</p>
                      <p className="text-xs text-muted-foreground">
                        {template.category}
                      </p>
                    </div>)
                )) : <div className="text-sm text-muted-foreground h-full flex items-center justify-center">No templates found</div>}
              <div className="pt-4 mt-auto">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-full"
                  onClick={() => setOpenTemplateInfoDialog(true)}
                >
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
      <SendOverlay
        open={openSendOverlay}
        templates={templates}
        onClose={() => setOpenSendOverlay(false)}
        handleSend={handleSend}
        handleChange={handleChange}
      />

      {/* Template Info Dialog */}
      <Dialog open={openTemplateInfoDialog} onOpenChange={setOpenTemplateInfoDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Template</DialogTitle>
            <DialogDescription>
              Provide basic details before designing your email.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">

            <div className="space-y-2">
              <Label htmlFor="temp-name">Template Name</Label>
              <Input
                id="temp-name"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Template Name"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Label htmlFor="temp-title">Subject</Label>
              </div>
              <Input
                id="temp-title"
                value={templateTitle}
                onChange={(e) => setTemplateTitle(e.target.value)}
                placeholder="Subject"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="temp-category">Category</Label>
              <select
                id="temp-category"
                className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
                value={templateCategory}
                onChange={(e) => setTemplateCategory(e.target.value)}
              >
                <option value="Festive">Festive</option>
                {/* <option value="Campaign">Campaign</option> */}
                <option value="General">General</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setOpenTemplateInfoDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setOpenTemplateInfoDialog(false);
                setOpenTemplateDialog(true);
              }}
            >
              Next
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Email Template Editor Dialog */}
      <Dialog
        open={openTemplateDialog}
        onOpenChange={(open) => {
          if (!open) {
            // User attempted to close – ask for confirmation first
            setConfirmCloseDialog(true);
            return; // keep editor open until user decides
          }
          setOpenTemplateDialog(true);
        }}
      >
        <DialogContent
          className="p-0 w-[95vw] h-[90vh] max-w-none rounded-lg"
        >
          <EmailTemplateEditor
            ref={emailEditorHandle}
            templateName={templateName}
            templateTitle={templateTitle}
            templateCategory={templateCategory}
            handleTemplates={handleTemplates}
            handleFetchCampaigns={handleFetchCampaigns}
            onCloseRequest={() => {
              setConfirmCloseDialog(false)
              setOpenTemplateDialog(false)

            }}
          />
        </DialogContent>
      </Dialog>

      {/* Confirm Close Dialog */}
      <Dialog open={confirmCloseDialog} onOpenChange={setConfirmCloseDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Close editor?</DialogTitle>
            <DialogDescription>
              Do you want to save changes before leaving?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-4">
            {/* <Button
              variant="default"
              onClick={() => {
                // Save and close
                emailEditorHandle.current?.exportHtml();
                setConfirmCloseDialog(false);
                setOpenTemplateDialog(false);
              }}
            >
              Save changes
            </Button> */}
            <Button
              variant="destructive"
              onClick={() => {
                setConfirmCloseDialog(false);
                setOpenTemplateDialog(false);
              }}
            >
              Abort
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                // Just close
                setConfirmCloseDialog(false);
                setOpenTemplateDialog(true);
              }}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
