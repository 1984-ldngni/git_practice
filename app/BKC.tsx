"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { FileText, Download } from "lucide-react"

// Initial state definitions
const initialMonthlyActuals = {
  attySupport: "",
  billing: "",
  cs: "",
  vms: "",
  emails: "",
  hpage: "",
  exp: "",
  fax: "",
}
const initialAvgCalls = {
  previousMonth: "",
  attySup: "",
  cService: "",
  cSupport: "",
  attyRel: "",
}
const initialInvoiceFields = {
  attySupportHrs: "",
  cServiceHrs: "",
  cSupportHrs: "",
  chatEmailHrs: "",
  attyRelHrs: "",
  bookkeepingHrs: "",
  administrativeHrs: "",
  uploadingCertQty: "",
  faxCertQty: "",
}

const initialInvoiceInfo = {
  invoiceNumber: "",
  invoiceDate: "",
  dueDate: "",
  clientNumber: "",
}

// Fixed rates & agent counts
const fixedRates = {
  attySupport: 14,
  cService: 12,
  cSupport: 12,
  chatEmail: 12,
  attyRel: 14,
  bookkeeping: 14,
  administrative: 12,
  uploadingCert: 3,
  faxCert: 1.25,
}
const agentCounts = {
  attySupport: 1,
  cService: 9,
  cSupport: 4,
  chatEmail: 3,
  attyRel: 1,
  bookkeeping: 1.5,
  administrative: 75,
}

// Change the export name to avoid conflicts
export default function BKCApp() {
  // State
  const [monthlyActuals, setMonthlyActuals] = useState(initialMonthlyActuals)
  const [avgCalls, setAvgCalls] = useState(initialAvgCalls)
  const [invoiceFields, setInvoiceFields] = useState(initialInvoiceFields)
  const [invoiceInfo, setInvoiceInfo] = useState(initialInvoiceInfo)

  // Load data from localStorage on component mount
  useEffect(() => {
    // Update localStorage keys to be BKC-specific
    const savedMonthlyActuals = localStorage.getItem("bkcApp_monthlyActuals")
    const savedAvgCalls = localStorage.getItem("bkcApp_avgCalls")
    const savedInvoiceFields = localStorage.getItem("bkcApp_invoiceFields")
    const savedInvoiceInfo = localStorage.getItem("bkcApp_invoiceInfo")

    if (savedMonthlyActuals) {
      setMonthlyActuals(JSON.parse(savedMonthlyActuals))
    }
    if (savedAvgCalls) {
      setAvgCalls(JSON.parse(savedAvgCalls))
    }
    if (savedInvoiceFields) {
      setInvoiceFields(JSON.parse(savedInvoiceFields))
    }
    if (savedInvoiceInfo) {
      setInvoiceInfo(JSON.parse(savedInvoiceInfo))
    }
  }, [])

  // Handlers
  const handleMonthlyActualChange = (f, v) => setMonthlyActuals((p) => ({ ...p, [f]: v }))
  const handleAvgCallsChange = (f, v) => setAvgCalls((p) => ({ ...p, [f]: v }))
  const handleInvoiceFieldChange = (f, v) => setInvoiceFields((p) => ({ ...p, [f]: v }))
  const handleInvoiceInfoChange = (f, v) => setInvoiceInfo((p) => ({ ...p, [f]: v }))

  // +20% computations (rounded) - update this calculation
  const callsPlus20 = Math.round(
    ((Number.parseFloat(monthlyActuals.attySupport) || 0) +
      (Number.parseFloat(monthlyActuals.billing) || 0) +
      (Number.parseFloat(monthlyActuals.cs) || 0) +
      (Number.parseFloat(monthlyActuals.vms) || 0)) *
      1.2,
  )
  const chatsPlus20 = Math.round((Number.parseFloat(monthlyActuals.emails) || 0) * 1.2)

  // Percentage outcome = current/previous ×100
  const pctOutcome = () => {
    const curr = callsPlus20
    const prev = Number.parseFloat(avgCalls.previousMonth) || 0
    return prev === 0 ? 0 : (curr / prev) * 100
  }

  // Category calc
  const calculateCategory = (key) => {
    const pct = pctOutcome()
    const val = Number.parseFloat(avgCalls[key]) || 0
    return (val * pct) / 100
  }

  // Clear/save
  const clearAll = () => {
    setMonthlyActuals(initialMonthlyActuals)
    setAvgCalls(initialAvgCalls)
    setInvoiceFields(initialInvoiceFields)
    setInvoiceInfo(initialInvoiceInfo)
    // Update all localStorage.setItem and removeItem calls to use "bkcApp_" prefix instead of "agencyApp_"
    localStorage.removeItem("bkcApp_monthlyActuals")
    localStorage.removeItem("bkcApp_avgCalls")
    localStorage.removeItem("bkcApp_invoiceFields")
    localStorage.removeItem("bkcApp_invoiceInfo")
    alert("All data cleared")
  }
  const saveAll = () => {
    // Update all localStorage.setItem and removeItem calls to use "bkcApp_" prefix instead of "agencyApp_"
    localStorage.setItem("bkcApp_monthlyActuals", JSON.stringify(monthlyActuals))
    localStorage.setItem("bkcApp_avgCalls", JSON.stringify(avgCalls))
    localStorage.setItem("bkcApp_invoiceFields", JSON.stringify(invoiceFields))
    localStorage.setItem("bkcApp_invoiceInfo", JSON.stringify(invoiceInfo))
    alert("All data saved successfully")
  }
  const clearInvoice = () => {
    setInvoiceFields(initialInvoiceFields)
    setInvoiceInfo(initialInvoiceInfo)
    localStorage.removeItem("agencyApp_invoiceFields")
    localStorage.removeItem("agencyApp_invoiceInfo")
    alert("Invoice data cleared")
  }
  const saveInvoice = () => {
    localStorage.setItem("agencyApp_invoiceFields", JSON.stringify(invoiceFields))
    localStorage.setItem("agencyApp_invoiceInfo", JSON.stringify(invoiceInfo))
    alert("Invoice data saved successfully")
  }

  // Invoice totals
  const invoice1Total = [
    "attySupportHrs",
    "cServiceHrs",
    "cSupportHrs",
    "chatEmailHrs",
    "attyRelHrs",
    "bookkeepingHrs",
    "administrativeHrs",
  ]
    .map((key, i) => {
      const hrs = Number.parseFloat(invoiceFields[key]) || 0
      const rateKey = ["attySupport", "cService", "cSupport", "chatEmail", "attyRel", "bookkeeping", "administrative"][
        i
      ]
      return hrs * fixedRates[rateKey]
    })
    .reduce((a, b) => a + b, 0)
  const invoice2Total =
    (Number.parseFloat(monthlyActuals.exp) || 0) * fixedRates.uploadingCert +
    (Number.parseFloat(monthlyActuals.fax) || 0) * fixedRates.faxCert

  const monthlyTotal = invoice1Total + invoice2Total

  // Generate PDF functions
  const generateInvoice1PDF = () => {
    const printWindow = window.open("", "_blank")
    const invoice1HTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice 1 - Services</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          margin: 0; 
          padding: 20px;
          font-size: 12px;
        }
        .invoice-container {
          width: 100%;
          max-width: 8.5in;
          margin: 0 auto;
        }
        .header-section {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }
        .invoice-title {
          font-size: 24px;
          font-weight: bold;
        }
        .company-info {
          text-align: right;
          font-size: 10px;
        }
        .invoice-details {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .left-details, .right-details {
          width: 48%;
        }
        .bill-to {
          margin-bottom: 10px;
        }
        .payment-section {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          font-size: 11px;
        }
        .payment-left, .payment-right {
          width: 48%;
        }
        .payment-left div, .payment-right div {
          margin-bottom: 8px;
        }
        .footer-info {
          font-size: 10px;
          margin-bottom: 20px;
          text-align: center;
        }
        .transactions-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .important-section {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          font-size: 11px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
          font-size: 11px;
        }
        th, td {
          border: 1px solid #000;
          padding: 4px;
          text-align: left;
        }
        th {
          background-color: #f0f0f0;
          font-weight: bold;
        }
        .section-header {
          font-weight: bold;
          background-color: #f5f5f5;
        }
        .page-footer {
          position: fixed;
          bottom: 20px;
          right: 20px;
          font-size: 10px;
        }
        .underline {
          border-bottom: 1px solid #000;
          display: inline-block;
          min-width: 100px;
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="header-section">
          <div class="invoice-title">Invoice</div>
          <div class="company-info">
            <strong>INFORMAL</strong><br>
            The GRN Suite Dover DE<br>
            info@informal.com
          </div>
        </div>
        
        <div class="invoice-details">
          <div class="left-details">
            <div>Date: <span class=" ">${invoiceInfo.invoiceDate || " "}</span></div>
            <br>
            <div>Invoice #: <span class=" ">${invoiceInfo.invoiceNumber || " "}</span></div>
          </div>
          <div class="right-details">
            <div class="bill-to">
              <strong>Bill To</strong><br>
              BKClass.com<br>
              8956 Tuscan Valley Place<br>
              Orlando, FL 32825
            </div>
            <div>Client No: 1938 <span class=" ">${invoiceInfo.clientNumber || " "}</span></div>
          </div>
        </div>
        
        <div class="payment-section">
          <div class="payment-left">
            <div>Due Date: <span class=" ">${invoiceInfo.dueDate || " "}</span></div>
            <div>Payment Due: <span class=" ">$${invoice1Total.toFixed(2)}</span></div>
            <div>Total: <span class=" ">$${invoice1Total.toFixed(2)}</span></div>
          </div>
          <div class="payment-right">
            <div>Balance Due: <span class=" ">$${invoice1Total.toFixed(2)}</span></div>
            <div>Amount Enclosed: <span class=" ">$ 0.00 </span></div>
            <div>Payments/Credits: <span class=" ">$ 0.00 </span></div>
          </div>
        </div>
        
        <div class="footer-info">
          Billing Questions: info@informal.com | Make all checks payable to Informal | For Direct Deposit Wells Fargo Acct# 5563-2224-04<br>
          Total due as per terms. Overdue accounts subject to a service charge per month
        </div>
        
        <div class="transactions-header">
          <div><strong>TRANSACTIONS SUMMARY</strong></div>
          <div><strong>IMPORTANT NOTES:</strong></div>
        </div>
        
        <div class="important-section">
          <div>Date Paid: <span class=" "> </span></div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>No of Hrs</th>
              <th>No of Calls/Chat</th>
              <th>Rate</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr class="section-header">
              <td colspan="5"><strong>By Telephone Services</strong></td>
            </tr>
            <tr>
              <td>Attorney Support</td>
              <td>${invoiceFields.attySupportHrs || ""}</td>
              <td>${Math.round(calculateCategory("attySup") * (Number.parseFloat(invoiceFields.attySupportHrs) || 0)) || ""}</td>
              <td>$${fixedRates.attySupport.toFixed(2)}</td>
              <td>$${Math.round((Number.parseFloat(invoiceFields.attySupportHrs) || 0) * fixedRates.attySupport) || ""}</td>
            </tr>
            <tr>
              <td>Customer Service</td>
              <td>${invoiceFields.cServiceHrs || ""}</td>
              <td>${Math.round(calculateCategory("cService") * (Number.parseFloat(invoiceFields.cServiceHrs) || 0)) || ""}</td>
              <td>$${fixedRates.cService.toFixed(2)}</td>
              <td>$${Math.round((Number.parseFloat(invoiceFields.cServiceHrs) || 0) * fixedRates.cService) || ""}</td>
            </tr>
            <tr>
              <td>Customer Support</td>
              <td>${invoiceFields.cSupportHrs || ""}</td>
              <td>${Math.round(calculateCategory("cSupport") * (Number.parseFloat(invoiceFields.cSupportHrs) || 0)) || ""}</td>
              <td>$${fixedRates.cSupport.toFixed(2)}</td>
              <td>$${Math.round((Number.parseFloat(invoiceFields.cSupportHrs) || 0) * fixedRates.cSupport) || ""}</td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr class="section-header">
              <td colspan="5"><strong>By Chat Services</strong></td>
            </tr>
            <tr>
              <td>Chat & Email Support</td>
              <td>${invoiceFields.chatEmailHrs || ""}</td>
              <td>${Math.round(calculateCategory("attySup") * (Number.parseFloat(invoiceFields.chatEmailHrs) || 0)) || ""}</td>
              <td>$${fixedRates.chatEmail.toFixed(2)}</td>
              <td>$${Math.round((Number.parseFloat(invoiceFields.chatEmailHrs) || 0) * fixedRates.chatEmail) || ""}</td>
            </tr>
            <tr>
              <td>Attorney/Management Services</td>
              <td>${invoiceFields.attyRelHrs || ""}</td>
              <td>${Math.round(calculateCategory("attyRel") * (Number.parseFloat(invoiceFields.attyRelHrs) || 0)) || ""}</td>
              <td>$${fixedRates.attyRel.toFixed(2)}</td>
              <td>$${Math.round((Number.parseFloat(invoiceFields.attyRelHrs) || 0) * fixedRates.attyRel) || ""}</td>
            </tr>
            <tr>
              <td>Book keeping</td>
              <td>${invoiceFields.bookkeepingHrs || ""}</td>
              <td></td>
              <td>$${fixedRates.bookkeeping.toFixed(2)}</td>
              <td>$${Math.round((Number.parseFloat(invoiceFields.bookkeepingHrs) || 0) * fixedRates.bookkeeping) || ""}</td>
            </tr>
            <tr>
              <td>Administrative</td>
              <td>${invoiceFields.administrativeHrs || ""}</td>
              <td></td>
              <td>$${fixedRates.administrative.toFixed(2)}</td>
              <td>$${Math.round((Number.parseFloat(invoiceFields.administrativeHrs) || 0) * fixedRates.administrative) || ""}</td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
        
        <div class="page-footer">
          Page 1
        </div>
      </div>
    </body>
    </html>
  `
    printWindow.document.write(invoice1HTML)
    printWindow.document.close()
    printWindow.print()
  }

  const generateInvoice2PDF = () => {
    const printWindow = window.open("", "_blank")
    const invoice2HTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice 2 - Back Office</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          margin: 0; 
          padding: 20px;
          font-size: 12px;
        }
        .invoice-container {
          width: 100%;
          max-width: 8.5in;
          margin: 0 auto;
        }
        .header-section {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }
        .invoice-title {
          font-size: 24px;
          font-weight: bold;
        }
        .company-info {
          text-align: right;
          font-size: 10px;
        }
        .invoice-details {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .left-details, .right-details {
          width: 48%;
        }
        .bill-to {
          margin-bottom: 10px;
        }
        .payment-section {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          font-size: 11px;
        }
        .payment-left, .payment-right {
          width: 48%;
        }
        .payment-left div, .payment-right div {
          margin-bottom: 8px;
        }
        .footer-info {
          font-size: 10px;
          margin-bottom: 20px;
          text-align: center;
        }
        .transactions-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .important-section {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          font-size: 11px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
          font-size: 11px;
        }
        th, td {
          border: 1px solid #000;
          padding: 4px;
          text-align: left;
        }
        th {
          background-color: #f0f0f0;
          font-weight: bold;
        }
        .section-header {
          font-weight: bold;
          background-color: #f5f5f5;
        }
        .page-footer {
          position: fixed;
          bottom: 20px;
          right: 20px;
          font-size: 10px;
        }
        .underline {
          border-bottom: 1px solid #000;
          display: inline-block;
          min-width: 100px;
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="header-section">
          <div class="invoice-title">Invoice</div>
          <div class="company-info">
            <strong>INFORMAL</strong><br>
            The GRN Suite Dover DE<br>
            info@informal.com
          </div>
        </div>
        
        <div class="invoice-details">
          <div class="left-details">
            <div>Date: <span class=" ">${invoiceInfo.invoiceDate || " "}</span></div>
            <br>
            <div>Invoice #: <span class=" ">${invoiceInfo.invoiceNumber || " "}</span></div>
          </div>
          <div class="right-details">
            <div class="bill-to">
              <strong>Bill To</strong><br>
              BKClass.com<br>
              8956 Tuscan Valley Place<br>
              Orlando, FL 32825
            </div>
            <div>Client No: 1938 <span class=" ">${invoiceInfo.clientNumber || " "}</span></div>
          </div>
        </div>
        
        <div class="payment-section">
          <div class="payment-left">
            <div>Due Date: <span class=" ">${invoiceInfo.dueDate || " "}</span></div>
            <div>Payment Due: <span class=" ">$${invoice2Total.toFixed(2)}</span></div>
            <div>Total: <span class=" ">$${invoice2Total.toFixed(2)}</span></div>
          </div>
          <div class="payment-right">
            <div>Balance Due: <span class=" ">$${invoice2Total.toFixed(2)}</span></div>
            <div>Amount Enclosed: <span class=" ">$ 0.00 </span></div>
            <div>Payments/Credits: <span class=" ">$ 0.00</span></div>
          </div>
        </div>
        
        <div class="footer-info">
          Billing Questions: info@informal.com | Make all checks payable to Informal | For Direct Deposit Wells Fargo Acct# 5563-2224-04<br>
          Total due as per terms. Overdue accounts subject to a service charge per month
        </div>
        
        <div class="transactions-header">
          <div><strong>TRANSACTIONS SUMMARY</strong></div>
          <div><strong>IMPORTANT NOTES:</strong></div>
        </div>
        
        <div class="important-section">
          <div>Date Paid: <span class=" "> </span></div>
         
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr class="section-header">
              <td colspan="4"><strong>Back Office</strong></td>
            </tr>
            <tr>
              <td>Uploading Certificates</td>
              <td>${monthlyActuals.exp || ""}</td>
              <td>$${fixedRates.uploadingCert.toFixed(2)}</td>
              <td>$${Math.round((Number.parseFloat(monthlyActuals.exp) || 0) * fixedRates.uploadingCert) || ""}</td>
            </tr>
            <tr>
              <td>Fax Certificates</td>
              <td>${monthlyActuals.fax || ""}</td>
              <td>$${fixedRates.faxCert.toFixed(2)}</td>
              <td>$${Math.round((Number.parseFloat(monthlyActuals.fax) || 0) * fixedRates.faxCert) || ""}</td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
        
        <div class="page-footer">
          Page 1
        </div>
      </div>
    </body>
    </html>
  `
    printWindow.document.write(invoice2HTML)
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold"></h1>
        <p className="text-gray-600 mt-2"></p>
      </div>

      {/* Invoice Information Card */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader>
          <CardTitle>Invoice Information</CardTitle>
          <CardDescription>Enter invoice details for PDF generation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input
                id="invoiceNumber"
                type="text"
                placeholder="INV-001"
                value={invoiceInfo.invoiceNumber}
                onChange={(e) => handleInvoiceInfoChange("invoiceNumber", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientNumber">Client Number</Label>
              <Input
                id="clientNumber"
                type="text"
                placeholder="CLIENT-001"
                value={invoiceInfo.clientNumber}
                onChange={(e) => handleInvoiceInfoChange("clientNumber", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invoiceDate">Invoice Date</Label>
              <Input
                id="invoiceDate"
                type="date"
                value={invoiceInfo.invoiceDate}
                onChange={(e) => handleInvoiceInfoChange("invoiceDate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date:</Label>
              <Input
                id="dueDate"
                type="date"
                value={invoiceInfo.dueDate}
                onChange={(e) => handleInvoiceInfoChange("dueDate", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top cards */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Actuals */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle>Monthly Actual #s</CardTitle>
            <CardDescription>Enter actual monthly numbers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(monthlyActuals).map(([k, v]) => (
                <div key={k} className="space-y-2">
                  <Label htmlFor={k}>{k}</Label>
                  <Input
                    id={k}
                    type="number"
                    placeholder="0"
                    value={v}
                    onChange={(e) => handleMonthlyActualChange(k, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ave # Calls */}
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle>Ave # Calls</CardTitle>
            <CardDescription>Comparison metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label>Current Month</Label>
                <Input type="number" value={callsPlus20} readOnly className="bg-gray-100" />
              </div>
              <div>
                <Label htmlFor="previous-month">Previous Month</Label>
                <Input
                  id="previous-month"
                  type="number"
                  placeholder="0"
                  value={avgCalls.previousMonth}
                  onChange={(e) => handleAvgCallsChange("previousMonth", e.target.value)}
                />
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center mb-4">
              <div className="text-sm font-medium">Percentage Outcome</div>
              <div className="text-2xl font-bold mt-1">{pctOutcome().toFixed(2)}%</div>
            </div>
            <h4 className="mb-2 font-medium">Category Calculations</h4>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { key: "attySup", label: "Atty Sup" },
                { key: "cService", label: "C Service" },
                { key: "cSupport", label: "C Support" },
                { key: "attyRel", label: "Atty Rel" },
              ].map(({ key, label }) => (
                <div key={key} className="space-y-1">
                  <Label htmlFor={key}>{label}</Label>
                  <Input
                    id={key}
                    type="number"
                    placeholder="0"
                    value={avgCalls[key]}
                    onChange={(e) => handleAvgCallsChange(key, e.target.value)}
                  />
                  <div className="font-medium">= {calculateCategory(key).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Global actions */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={clearAll}>
          Clear
        </Button>
        <Button onClick={saveAll}>Save</Button>
      </div>

      {/* Invoice Mock Up */}
      <Card className="mt-6 bg-purple-50 border-purple-200">
        <CardHeader>
          <CardTitle>Invoice Mock Up</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Top Invoice rows - simplified */}
          <div className="grid grid-cols-4 border-b pb-2 mb-2 font-medium">
            <div></div>
            <div>120%</div>
          </div>
          {[
            {
              key: "calls",
              label: "Calls",
              value:
                Math.round(
                  (Number.parseFloat(monthlyActuals.attySupport) || 0) +
                    (Number.parseFloat(monthlyActuals.billing) || 0) +
                    (Number.parseFloat(monthlyActuals.cs) || 0) +
                    (Number.parseFloat(monthlyActuals.vms) || 0),
                ) * 1.2,
            },
            {
              key: "chatsEmails",
              label: "Chats / Emails",
              value: Math.round((Number.parseFloat(monthlyActuals.emails) || 0) * 1.2),
            },
          ].map(({ key, label, value }) => (
            <div key={key} className="grid grid-cols-4 items-center py-1 gap-4">
              <div>{label}</div>
              <div>{Math.round(value)}</div>
            </div>
          ))}

          {/* Category Hours */}
          <div className="mt-6 mb-6">
            <div className="grid grid-cols-6 border-b pb-2 mb-2">
              <div></div>
              <div>Hrs</div>
              <div>Rate</div>
              <div># Calls/Chat</div>
              <div>Amount</div>
              <div># Agents</div>
            </div>
            {[
              {
                key: "attySupportHrs",
                label: "Atty Support",
                rateKey: "attySupport",
                avgKey: "attySup",
              },
              {
                key: "cServiceHrs",
                label: "CSer",
                rateKey: "cService",
                avgKey: "cService",
              },
              {
                key: "cSupportHrs",
                label: "CSup",
                rateKey: "cSupport",
                avgKey: "cSupport",
              },
              {
                key: "chatEmailHrs",
                label: "Chat/Email",
                rateKey: "chatEmail",
                avgKey: "",
              },
              {
                key: "attyRelHrs",
                label: "Atty Rel",
                rateKey: "attyRel",
                avgKey: "attyRel",
              },
              {
                key: "bookkeepingHrs",
                label: "Bookkeeping",
                rateKey: "bookkeeping",
                avgKey: "",
              },
              {
                key: "administrativeHrs",
                label: "Administrative",
                rateKey: "administrative",
                avgKey: "",
              },
            ].map(({ key, label, rateKey, avgKey }) => {
              const hrs = Number.parseFloat(invoiceFields[key]) || 0
              const rate = fixedRates[rateKey]
              const callsChat = avgKey ? calculateCategory(avgKey) * hrs : 0
              const amount = hrs * rate
              const agents = agentCounts[rateKey]

              return (
                <div key={key} className="grid grid-cols-6 items-center py-1 gap-4">
                  <div>{label}</div>
                  <Input
                    type="number"
                    placeholder="0"
                    value={invoiceFields[key]}
                    onChange={(e) => handleInvoiceFieldChange(key, e.target.value)}
                  />
                  <div>{rate.toFixed(2)}</div>
                  <div>{Math.round(callsChat)}</div>
                  <div>{Math.round(amount)}</div>
                  <div>{agents}</div>
                </div>
              )
            })}
          </div>

          {/* INVOICE 1 TOTAL - directly after Administrative row */}
          <div className="border-t pt-2 mt-2">
            <div className="grid grid-cols-6 items-center py-2 gap-4 font-semibold bg-gray-50">
              <div>INVOICE 1 TOTAL</div>
              <div></div>
              <div></div>
              <div></div>
              <div>{invoice1Total.toFixed(2)}</div>
              <div></div>
            </div>
          </div>

          {/* Uploading Cert and Fax Cert */}
          <div className="mt-6 mb-6">
            <div className="grid grid-cols-6 border-b pb-2 mb-2">
              <div></div>
              <div>Qty</div>
              <div>Rate</div>
              <div></div>
              <div>Amount</div>
              <div></div>
            </div>

            <div className="grid grid-cols-6 items-center py-1 gap-4">
              <div>Uploading Cert</div>
              <Input type="number" placeholder="0" value={monthlyActuals.exp} readOnly className="bg-gray-100" />
              <div>{fixedRates.uploadingCert.toFixed(2)}</div>
              <div></div>
              <div>{Math.round((Number.parseFloat(monthlyActuals.exp) || 0) * fixedRates.uploadingCert)}</div>
              <div></div>
            </div>

            <div className="grid grid-cols-6 items-center py-1 gap-4">
              <div>Fax Cert</div>
              <Input type="number" placeholder="0" value={monthlyActuals.fax} readOnly className="bg-gray-100" />
              <div>{fixedRates.faxCert.toFixed(2)}</div>
              <div></div>
              <div>{Math.round((Number.parseFloat(monthlyActuals.fax) || 0) * fixedRates.faxCert)}</div>
              <div></div>
            </div>

            {/* INVOICE 2 TOTAL - directly after Fax Cert */}
            <div className="border-t pt-2 mt-2">
              <div className="grid grid-cols-6 items-center py-2 gap-4 font-semibold bg-gray-50">
                <div>INVOICE 2 TOTAL</div>
                <div></div>
                <div></div>
                <div></div>
                <div>{invoice2Total.toFixed(2)}</div>
                <div></div>
              </div>
            </div>

            {/* MONTHLY TOTAL */}
            <div className="border-t pt-2 mt-4">
              <div className="grid grid-cols-6 items-center py-2 gap-4 font-bold bg-gray-100 text-lg">
                <div>MONTHLY TOTAL</div>
                <div></div>
                <div></div>
                <div></div>
                <div>{monthlyTotal.toFixed(2)}</div>
                <div></div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex space-x-4">
            <Button onClick={generateInvoice1PDF} className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Generate Invoice 1 PDF
            </Button>
            <Button onClick={generateInvoice2PDF} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Generate Invoice 2 PDF
            </Button>
          </div>
          <div className="flex space-x-4">
            <Button variant="outline" onClick={clearInvoice}>
              Clear Invoice
            </Button>
            <Button onClick={saveInvoice}>Save Invoice</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
