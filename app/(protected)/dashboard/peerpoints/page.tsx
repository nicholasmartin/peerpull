import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Coins, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  Filter, 
  Download, 
  TrendingUp, 
  Zap, 
  Award, 
  Gift 
} from "lucide-react";

export default function PeerPointsPage() {
  // Mock data for UI mockup
  const peerPointsBalance = 12;
  const pendingPeerPoints = 4;
  
  const transactionHistory = [
    {
      id: 1,
      type: "earned",
      amount: 2,
      description: "Completed review for 'AI Content Generator'",
      date: "2025-04-22",
      status: "completed"
    },
    {
      id: 2,
      type: "earned",
      amount: 2,
      description: "Completed review for 'Smart Home IoT Platform'",
      date: "2025-04-18",
      status: "completed"
    },
    {
      id: 3,
      type: "spent",
      amount: 1,
      description: "Submitted PullRequest 'SaaS Dashboard'",
      date: "2025-04-30",
      status: "completed"
    },
    {
      id: 4,
      type: "pending",
      amount: 2,
      description: "Review in progress for 'Remote Team Collaboration Tool'",
      date: "2025-04-30",
      status: "pending"
    },
    {
      id: 5,
      type: "pending",
      amount: 2,
      description: "Review in progress for 'Crypto Portfolio Tracker'",
      date: "2025-04-25",
      status: "pending"
    },
    {
      id: 6,
      type: "earned",
      amount: 3,
      description: "Bonus for high-quality review",
      date: "2025-04-10",
      status: "completed"
    },
    {
      id: 7,
      type: "spent",
      amount: 2,
      description: "Priority placement for 'Mobile App Concept'",
      date: "2025-04-25",
      status: "completed"
    }
  ];
  
  const rewards = [
    {
      id: 1,
      title: "Priority PullRequest",
      description: "Get your PullRequest to the top of the review queue",
      cost: 2,
      icon: <Zap className="h-8 w-8 text-yellow-500" />
    },
    {
      id: 2,
      title: "Expert Review",
      description: "Get a review from a verified expert in your field",
      cost: 5,
      icon: <Award className="h-8 w-8 text-blue-500" />
    },
    {
      id: 3,
      title: "Additional Reviewers",
      description: "Add an extra reviewer to your PullRequest",
      cost: 3,
      icon: <TrendingUp className="h-8 w-8 text-green-500" />
    },
    {
      id: 4,
      title: "Founder Spotlight",
      description: "Get featured in our weekly founder spotlight",
      cost: 8,
      icon: <Gift className="h-8 w-8 text-purple-500" />
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">PeerPoints</h1>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Available Balance</CardTitle>
            <CardDescription>Your current PeerPoints</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Coins className="h-8 w-8 text-yellow-500 mr-3" />
              <div className="text-3xl font-bold">{peerPointsBalance}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pending</CardTitle>
            <CardDescription>PeerPoints awaiting completion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-blue-500 mr-3" />
              <div className="text-3xl font-bold">{pendingPeerPoints}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Lifetime Total</CardTitle>
            <CardDescription>All PeerPoints earned</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Award className="h-8 w-8 text-purple-500 mr-3" />
              <div className="text-3xl font-bold">24</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="history" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="history">Transaction History</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
        </TabsList>
        
        <TabsContent value="history" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Recent Transactions</h2>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
          
          <div className="rounded-lg bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Transaction</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Date</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactionHistory.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-full mr-3 ${
                            transaction.type === 'earned' ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' : 
                            transaction.type === 'spent' ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400' :
                            'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400'
                          }`}>
                            {transaction.type === 'earned' ? <ArrowUpRight className="h-4 w-4" /> : 
                             transaction.type === 'spent' ? <ArrowDownRight className="h-4 w-4" /> :
                             <Clock className="h-4 w-4" />}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-gray-100">
                              {transaction.type === 'earned' ? 'Earned PeerPoints' : 
                               transaction.type === 'spent' ? 'Spent PeerPoints' : 
                               'Pending PeerPoints'}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {transaction.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-600 dark:text-gray-300">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4">
                        {transaction.status === 'completed' ? (
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800">
                            Completed
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-800">
                            Pending
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className={`font-medium ${
                          transaction.type === 'earned' ? 'text-green-600 dark:text-green-400' : 
                          transaction.type === 'spent' ? 'text-red-600 dark:text-red-400' :
                          'text-yellow-600 dark:text-yellow-400'
                        }`}>
                          {transaction.type === 'earned' ? '+' : transaction.type === 'spent' ? '-' : '~'}
                          {transaction.amount} PeerPoints
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button variant="outline">
              View All Transactions
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="rewards" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {rewards.map((reward) => (
              <Card key={reward.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{reward.title}</CardTitle>
                      <CardDescription>{reward.description}</CardDescription>
                    </div>
                    {reward.icon}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center pt-2">
                    <div className="flex items-center">
                      <Coins className="h-5 w-5 text-yellow-500 mr-2" />
                      <span className="font-bold">{reward.cost} PeerPoints</span>
                    </div>
                    <Button 
                      className={peerPointsBalance >= reward.cost ? "bg-[#3366FF] hover:bg-blue-600" : "bg-gray-300 text-gray-600 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"}
                      disabled={peerPointsBalance < reward.cost}
                    >
                      Redeem
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>How to Earn More PeerPoints</CardTitle>
              <CardDescription>Complete these activities to increase your balance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                  <Award className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">Complete Reviews</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Earn 2 PeerPoints for each review you complete. Thorough, high-quality reviews may earn bonus points.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">Receive Helpful Votes</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    When founders mark your reviews as helpful, you'll earn additional PeerPoints.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400">
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">Complete Reviews Quickly</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Completing reviews before the deadline earns you a time bonus.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400">
                  <Gift className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">Invite Founders</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Earn 3 PeerPoints for each founder you invite who joins the platform.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
