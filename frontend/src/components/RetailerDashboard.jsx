
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { CheckCircle, XCircle, RefreshCw, Clock, MessageSquare, DollarSign } from "lucide-react";

const RetailerDashboard = () => {
  const [negotiations, setNegotiations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNegotiation, setSelectedNegotiation] = useState(null);
  const [counterOffer, setCounterOffer] = useState('');
  const [retailerMessage, setRetailerMessage] = useState('');
  const [refreshInterval, setRefreshInterval] = useState(null);
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    fetchNegotiations();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchNegotiations, 30000);
    setRefreshInterval(interval);
    
    return () => {
      if (refreshInterval) clearInterval(refreshInterval);
    };
  }, []);

  const fetchNegotiations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND}/api/negotiate/retailer/negotiations`);
      setNegotiations(response.data);
      
      // If we have a selected negotiation, refresh its data
      if (selectedNegotiation) {
        const updatedNegotiation = response.data.find(n => n._id === selectedNegotiation._id);
        if (updatedNegotiation) {
          setSelectedNegotiation(updatedNegotiation);
        }
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching negotiations:', error);
      setLoading(false);
    }
  };

  const selectNegotiation = async (negotiationId) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND}/api/negotiate/retailer/negotiations/${negotiationId}`);
      setSelectedNegotiation(response.data);
      
      // Reset inputs
      setCounterOffer('');
      setRetailerMessage('');
    } catch (error) {
      console.error('Error fetching negotiation details:', error);
    }
  };

  const acceptOffer = async () => {
    if (!selectedNegotiation) return;
    
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND}/api/negotiate/retailer/negotiations/${selectedNegotiation._id}/input`, {
        action: 'accept',
        message: retailerMessage || 'Your offer has been accepted. Thank you for your business!'
      });
      
      // Refresh negotiations
      fetchNegotiations();
      
      // Clear inputs
      setRetailerMessage('');
    } catch (error) {
      console.error('Error accepting offer:', error);
    }
  };

  const rejectOffer = async () => {
    if (!selectedNegotiation) return;
    
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND}/api/negotiate/retailer/negotiations/${selectedNegotiation._id}/input`, {
        action: 'reject',
        message: retailerMessage || 'We cannot accept your offer at this time.'
      });
      
      // Refresh negotiations
      fetchNegotiations();
      
      // Clear inputs
      setRetailerMessage('');
    } catch (error) {
      console.error('Error rejecting offer:', error);
    }
  };

  const sendCounterOffer = async () => {
    if (!selectedNegotiation || !counterOffer) return;
    
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND}/api/negotiate/retailer/negotiations/${selectedNegotiation._id}/input`, {
        action: 'counter',
        counterOffer: parseFloat(counterOffer),
        message: retailerMessage || `I can offer you a price of $${counterOffer} per unit instead.`
      });
      
      // Refresh negotiations
      fetchNegotiations();
      
      // Clear inputs
      setCounterOffer('');
      setRetailerMessage('');
    } catch (error) {
      console.error('Error sending counter offer:', error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1" /> Accepted</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>;
      case 'counter-offered':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200"><RefreshCw className="w-3 h-3 mr-1" /> Counter Offered</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200"><CheckCircle className="w-3 h-3 mr-1" /> Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const calculateDiscount = (initialPrice, budget, quantity) => {
    const totalInitialPrice = initialPrice * quantity;
    const totalBudget = budget;
    return ((totalInitialPrice - totalBudget) / totalInitialPrice * 100).toFixed(2);
  };

  const filterNegotiations = (status) => {
    if (status === 'active') {
      return negotiations.filter(n => n.status === 'active' || n.status === 'counter-offered');
    } else if (status === 'completed') {
      return negotiations.filter(n => n.status === 'accepted' || n.status === 'rejected' || n.status === 'completed');
    }
    return negotiations;
  };

  return (
    <div className="mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Retailer Negotiation Dashboard</h1>
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Active Negotiations</CardTitle>
              <CardDescription>
                Manage customer price negotiations
              </CardDescription>
              <Tabs defaultValue="active" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
                </div>
              ) : (
                <ScrollArea className="h-[400px]">
                  {filterNegotiations(activeTab).length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No {activeTab} negotiations found
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filterNegotiations(activeTab).map((negotiation) => (
                        <div
                          key={negotiation._id}
                          className={`p-3 rounded-md cursor-pointer transition-colors ${
                            selectedNegotiation && selectedNegotiation._id === negotiation._id
                              ? 'bg-blue-50 border border-blue-200'
                              : 'hover:bg-gray-50 border border-gray-100'
                          }`}
                          onClick={() => selectNegotiation(negotiation._id)}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <div className="font-medium truncate">
                              {negotiation.productId?.name || 'Product'}
                            </div>
                            {getStatusBadge(negotiation.status)}
                          </div>
                          <div className="text-sm text-gray-500 flex justify-between">
                            <span>
                              {negotiation.quantity} units at ${(negotiation.budget / negotiation.quantity).toFixed(2)}/unit
                            </span>
                            <span className="text-xs">
                              {formatDate(negotiation.updatedAt)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={fetchNegotiations}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="w-full lg:w-2/3">
          {selectedNegotiation ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Negotiation Details</CardTitle>
                  {getStatusBadge(selectedNegotiation.status)}
                </div>
                <CardDescription>
                  Negotiation ID: {selectedNegotiation._id}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Product</div>
                    <div className="p-3 bg-gray-50 rounded-md">
                      {selectedNegotiation.productId?.name || 'Product'}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Customer</div>
                    <div className="p-3 bg-gray-50 rounded-md">
                      {selectedNegotiation.customerId?.name || 'Customer'} ({selectedNegotiation.customerId?.email || 'No email'})
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Original Price</div>
                    <div className="p-3 bg-gray-50 rounded-md">
                      ${selectedNegotiation.initialPrice} per unit
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Quantity</div>
                    <div className="p-3 bg-gray-50 rounded-md">
                      {selectedNegotiation.quantity} units
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Customer Budget</div>
                    <div className="p-3 bg-gray-50 rounded-md">
                      ${selectedNegotiation.budget} total (${(selectedNegotiation.budget / selectedNegotiation.quantity).toFixed(2)} per unit)
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Discount Requested</div>
                    <div className="p-3 bg-gray-50 rounded-md">
                      {calculateDiscount(
                        selectedNegotiation.initialPrice,
                        selectedNegotiation.budget,
                        selectedNegotiation.quantity
                      )}%
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="text-sm font-medium mb-2">Conversation History</div>
                  <ScrollArea className="h-[200px] border rounded-md p-3">
                    <div className="space-y-3">
                      {selectedNegotiation.messages.map((message, index) => (
                        <div key={index} className="flex flex-col">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className={
                              message.role === 'customer' 
                                ? 'bg-blue-50 text-blue-700 border-blue-200' 
                                : message.role === 'retailer'
                                  ? 'bg-green-50 text-green-700 border-green-200'
                                  : 'bg-gray-50 text-gray-700 border-gray-200'
                            }>
                              {message.role === 'customer' 
                                ? 'Customer' 
                                : message.role === 'retailer' 
                                  ? 'You (Retailer)' 
                                  : 'AI Assistant'}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {formatDate(message.timestamp)}
                            </span>
                          </div>
                          <div className="pl-2 border-l-2 border-gray-200">
                            {message.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
                
                {selectedNegotiation.status === 'active' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Counter Offer (per unit)</div>
                        <div className="flex">
                          <div className="relative flex-grow">
                            <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                            <Input 
                              type="number" 
                              placeholder="Enter amount" 
                              className="pl-8"
                              value={counterOffer}
                              onChange={(e) => setCounterOffer(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Message (optional)</div>
                        <Textarea 
                          placeholder="Add a message to the customer..."
                          value={retailerMessage}
                          onChange={(e) => setRetailerMessage(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={acceptOffer}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Accept Offer
                      </Button>
                      <Button 
                        className="flex-1 bg-amber-600 hover:bg-amber-700"
                        onClick={sendCounterOffer}
                        disabled={!counterOffer}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Send Counter Offer
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                        onClick={rejectOffer}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                )}
                
                {selectedNegotiation.status === 'counter-offered' && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
                    <div className="font-medium text-amber-800 mb-2 flex items-center">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Counter Offer Sent
                    </div>
                    <div className="text-amber-700">
                      You've sent a counter offer of ${selectedNegotiation.counterOffer} per unit. Waiting for customer response.
                    </div>
                  </div>
                )}
                
                {(selectedNegotiation.status === 'accepted' || selectedNegotiation.status === 'rejected') && (
                  <div className={`p-4 ${
                    selectedNegotiation.status === 'accepted' 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-red-50 border border-red-200'
                  } rounded-md`}>
                    <div className={`font-medium ${
                      selectedNegotiation.status === 'accepted' 
                        ? 'text-green-800' 
                        : 'text-red-800'
                    } mb-2 flex items-center`}>
                      {selectedNegotiation.status === 'accepted' 
                        ? <CheckCircle className="w-4 h-4 mr-2" /> 
                        : <XCircle className="w-4 h-4 mr-2" />}
                      {selectedNegotiation.status === 'accepted' 
                        ? 'Offer Accepted' 
                        : 'Offer Rejected'}
                    </div>
                    <div className={
                      selectedNegotiation.status === 'accepted' 
                        ? 'text-green-700' 
                        : 'text-red-700'
                    }>
                      {selectedNegotiation.status === 'accepted' 
                        ? `You've accepted the customer's offer of $${(selectedNegotiation.budget / selectedNegotiation.quantity).toFixed(2)} per unit for ${selectedNegotiation.quantity} units.` 
                        : 'You\'ve rejected this offer.'}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">No Negotiation Selected</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Select a negotiation from the list to view details and respond to customer offers.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default RetailerDashboard;
