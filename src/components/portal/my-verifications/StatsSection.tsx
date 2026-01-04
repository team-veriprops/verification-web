// "use client";

// import { Card, CardContent } from "@3rdparty/ui/card";
// import { Button } from "@3rdparty/ui/button";
// import { motion } from "framer-motion";
// import { useMyForSaleStore } from "@stores/useMyForSaleStore";
// import { Building2, Home, Briefcase, CheckCircle, Eye, MessageSquare } from "lucide-react";

// export function StatsSection() {const { statsFilter, setStatsFilter, getStats } = useMyForSaleStore();
//   const stats = getStats();

//   const filterButtons = [
//     { id: 'all', label: 'All', icon: Building2 },
//     { id: 'lands', label: 'Lands', icon: Building2 },
//     { id: 'houses', label: 'Houses', icon: Home },
//     { id: 'services', label: 'Services', icon: Briefcase },
//   ] as const;

//   const statCards = [
//     { 
//       label: 'Listings', 
//       value: stats.total, 
//       icon: Building2,
//       color: 'text-blue-600 dark:text-blue-400' 
//     },
//     { 
//       label: 'Active', 
//       value: stats.active, 
//       icon: CheckCircle,
//       color: 'text-green-600 dark:text-green-400' 
//     },
//     { 
//       label: 'Pending', 
//       value: stats.pending, 
//       icon: Building2,
//       color: 'text-orange-600 dark:text-orange-400' 
//     },
//     { 
//       label: 'Views', 
//       value: stats.totalViews, 
//       icon: Eye,
//       color: 'text-purple-600 dark:text-purple-400' 
//     },
//     { 
//       label: 'Inquiries', 
//       value: stats.totalInquiries, 
//       icon: MessageSquare,
//       color: 'text-indigo-600 dark:text-indigo-400' 
//     },
//     { 
//       label: 'Sold', 
//       value: stats.sold, 
//       icon: CheckCircle,
//       color: 'text-emerald-600 dark:text-emerald-400' 
//     },
//   ];

//   return (
//     <div className="space-y-6">
//       {/* Filter Buttons */}
//       <div className="flex flex-wrap gap-2">
//         {filterButtons.map(({ id, label, icon: Icon }) => (
//           <Button
//             key={id}
//             variant={statsFilter === id ? 'default' : 'outline'}
//             size="sm"
//             onClick={() => setStatsFilter(id)}
//             className="flex items-center gap-2"
//           >
//             <Icon className="h-4 w-4" />
//             {label}
//           </Button>
//         ))}
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
//         {statCards.map((stat, index) => {
//           const Icon = stat.icon;
//           return (
//             <motion.div
//               key={stat.label}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: index * 0.1 }}
//             >
//               <Card className="hover:shadow-md transition-shadow duration-200">
//                 <CardContent className="p-4">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm text-muted-foreground">{stat.label}</p>
//                       <p className="text-2xl font-bold">
//                         {stat.value.toLocaleString()}
//                       </p>
//                     </div>
//                     <Icon className={`h-8 w-8 ${stat.color}`} />
//                   </div>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };