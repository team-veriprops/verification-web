// import { useState, useMemo, SetStateAction } from "react";
// import { 
//   Table, 
//   TableBody, 
//   TableCell, 
//   TableHead, 
//   TableHeader, 
//   TableRow 
// } from "@3rdparty/ui/table";
// import { Button } from "@3rdparty/ui/button";
// import { Input } from "@3rdparty/ui/input";
// import { Checkbox } from "@3rdparty/ui/checkbox";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@3rdparty/ui/select";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@3rdparty/ui/dropdown-menu";
// import { 
//   Search, 
//   ChevronUp, 
//   ChevronDown, 
//   MoreHorizontal,
//   Download
// } from "lucide-react";

// export interface Column<T> {
//   key: keyof T | string;
//   label: string;
//   sortable?: boolean;
//   filterable?: boolean;
//   render?: (value: any, item: T) => React.ReactNode;
//   width?: string;
// }

// export interface Action<T> {
//   label: string;
//   onClick: (item: T) => void;
//   variant?: 'default' | 'destructive';
//   icon?: React.ComponentType<{ className?: string }>;
// }

// interface DataTableProps<T> {
//   data: T[];
//   columns: Column<T>[];
//   actions?: Action<T>[];
//   searchPlaceholder?: string;
//   onSelectionChange?: (selectedItems: T[]) => void;
//   bulkActions?: Action<T[]>[];
//   filters?: {
//     key: keyof T;
//     label: string;
//     options: { label: string; value: string }[];
//   }[];
//   className?: string;
// }

// export function DataTable3<T extends Record<string, any>>({
//   data,
//   columns,
//   actions = [],
//   searchPlaceholder = "Search...",
//   onSelectionChange,
//   bulkActions = [],
//   filters = [],
//   className
// }: DataTableProps<T>) {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortConfig, setSortConfig] = useState<{
//     key: keyof T | string;
//     direction: 'asc' | 'desc';
//   } | null>(null);
//   const [selectedItems, setSelectedItems] = useState<T[]>([]);
//   const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   // Filter and search data
//   const filteredData = useMemo(() => {
//     let result = data;

//     // Apply search
//     if (searchTerm) {
//       result = result.filter(item =>
//         Object.values(item).some(value =>
//           String(value).toLowerCase().includes(searchTerm.toLowerCase())
//         )
//       );
//     }

//     // Apply filters
//     Object.entries(activeFilters).forEach(([key, value]) => {
//       if (value) {
//         result = result.filter(item => String(item[key]) === value);
//       }
//     });

//     return result;
//   }, [data, searchTerm, activeFilters]);

//   // Sort data
//   const sortedData = useMemo(() => {
//     if (!sortConfig) return filteredData;

//     return [...filteredData].sort((a, b) => {
//       const aValue = a[sortConfig.key];
//       const bValue = b[sortConfig.key];

//       if (aValue < bValue) {
//         return sortConfig.direction === 'asc' ? -1 : 1;
//       }
//       if (aValue > bValue) {
//         return sortConfig.direction === 'asc' ? 1 : -1;
//       }
//       return 0;
//     });
//   }, [filteredData, sortConfig]);

//   // Paginate data
//   const paginatedData = useMemo(() => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     return sortedData.slice(startIndex, startIndex + itemsPerPage);
//   }, [sortedData, currentPage]);

//   const totalPages = Math.ceil(sortedData.length / itemsPerPage);

//   const handleSort = (key: keyof T | string) => {
//     const column = columns.find(col => col.key === key);
//     if (!column?.sortable) return;

//     setSortConfig(current => ({
//       key,
//       direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc'
//     }));
//   };

//   const handleSelectAll = (checked: boolean) => {
//     if (checked) {
//       setSelectedItems(paginatedData);
//     } else {
//       setSelectedItems([]);
//     }
//     onSelectionChange?.(checked ? paginatedData : []);
//   };

//   const handleSelectItem = (item: T, checked: boolean) => {
//     const newSelection = checked
//       ? [...selectedItems, item]
//       : selectedItems.filter(selected => selected !== item);
    
//     setSelectedItems(newSelection);
//     onSelectionChange?.(newSelection);
//   };

//   const exportToCSV = () => {
//     const headers = columns.map(col => col.label).join(',');
//     const rows = filteredData.map(item =>
//       columns.map(col => {
//         const value = item[col.key as keyof T];
//         return `"${String(value).replace(/"/g, '""')}"`;
//       }).join(',')
//     ).join('\n');
    
//     const csv = `${headers}\n${rows}`;
//     const blob = new Blob([csv], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'export.csv';
//     a.click();
//     window.URL.revokeObjectURL(url);
//   };

//   const getSortIcon = (columnKey: keyof T | string) => {
//     if (sortConfig?.key !== columnKey) return null;
//     return sortConfig.direction === 'asc' ? 
//       <ChevronUp className="h-4 w-4 ml-1" /> : 
//       <ChevronDown className="h-4 w-4 ml-1" />;
//   };

//   return (
//     <div className={`space-y-4 ${className}`}>
//       {/* Search and filters */}
//       <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
//         <div className="flex flex-1 items-center space-x-2">
//           <div className="relative flex-1 max-w-sm">
//             <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//             <Input
//               placeholder={searchPlaceholder}
//               value={searchTerm}
//               onChange={(e: { target: { value: SetStateAction<string>; }; }) => setSearchTerm(e.target.value)}
//               className="pl-10"
//             />
//           </div>
          
//           {filters.map(filter => (
//             <Select
//               key={String(filter.key)}
//               value={activeFilters[String(filter.key)] || "all"}
//               onValueChange={(value: string) => 
//                 setActiveFilters(prev => ({ 
//                   ...prev, 
//                   [String(filter.key)]: value === "all" ? "" : value 
//                 }))
//               }
//             >
//               <SelectTrigger className="w-40">
//                 <SelectValue placeholder={filter.label} />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All {filter.label}</SelectItem>
//                 {filter.options.map(option => (
//                   <SelectItem key={option.value} value={option.value}>
//                     {option.label}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           ))}
//         </div>

//         <div className="flex items-center space-x-2">
//           {selectedItems.length > 0 && bulkActions.length > 0 && (
//             <div className="flex items-center space-x-2">
//               <span className="text-sm text-muted-foreground">
//                 {selectedItems.length} selected
//               </span>
//               {bulkActions.map((action, index) => (
//                 <Button
//                   key={index}
//                   variant={action.variant || "outline"}
//                   size="sm"
//                   onClick={() => action.onClick(selectedItems)}
//                 >
//                   {action.icon && <action.icon className="h-4 w-4 mr-2" />}
//                   {action.label}
//                 </Button>
//               ))}
//             </div>
//           )}
          
//           <Button variant="outline" size="sm" onClick={exportToCSV}>
//             <Download className="h-4 w-4 mr-2" />
//             Export
//           </Button>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="border rounded-lg">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               {(onSelectionChange || bulkActions.length > 0) && (
//                 <TableHead className="w-12">
//                   <Checkbox
//                     checked={selectedItems.length === paginatedData.length && paginatedData.length > 0}
//                     onCheckedChange={handleSelectAll}
//                   />
//                 </TableHead>
//               )}
//               {columns.map(column => (
//                 <TableHead 
//                   key={String(column.key)} 
//                   className={column.sortable ? "cursor-pointer hover:bg-accent" : ""}
//                   style={{ width: column.width }}
//                   onClick={() => handleSort(column.key)}
//                 >
//                   <div className="flex items-center">
//                     {column.label}
//                     {getSortIcon(column.key)}
//                   </div>
//                 </TableHead>
//               ))}
//               {actions.length > 0 && (
//                 <TableHead className="w-20">Actions</TableHead>
//               )}
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {paginatedData.length === 0 ? (
//               <TableRow>
//                 <TableCell 
//                   colSpan={columns.length + (actions.length > 0 ? 1 : 0) + (onSelectionChange ? 1 : 0)}
//                   className="text-center py-8 text-muted-foreground"
//                 >
//                   No data found
//                 </TableCell>
//               </TableRow>
//             ) : (
//               paginatedData.map((item, index) => (
//                 <TableRow key={index}>
//                   {(onSelectionChange || bulkActions.length > 0) && (
//                     <TableCell>
//                       <Checkbox
//                         checked={selectedItems.includes(item)}
//                         onCheckedChange={(checked: boolean) => handleSelectItem(item, checked as boolean)}
//                       />
//                     </TableCell>
//                   )}
//                   {columns.map(column => (
//                     <TableCell key={String(column.key)}>
//                       {column.render 
//                         ? column.render(item[column.key as keyof T], item)
//                         : String(item[column.key as keyof T] || '')
//                       }
//                     </TableCell>
//                   ))}
//                   {actions.length > 0 && (
//                     <TableCell>
//                       <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                           <Button variant="ghost" size="icon">
//                             <MoreHorizontal className="h-4 w-4" />
//                           </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end">
//                           {actions.map((action, actionIndex) => (
//                             <DropdownMenuItem
//                               key={actionIndex}
//                               onClick={() => action.onClick(item)}
//                               className={action.variant === 'destructive' ? 'text-destructive' : ''}
//                             >
//                               {action.icon && <action.icon className="h-4 w-4 mr-2" />}
//                               {action.label}
//                             </DropdownMenuItem>
//                           ))}
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     </TableCell>
//                   )}
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex items-center justify-between">
//           <div className="text-sm text-muted-foreground">
//             Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} results
//           </div>
//           <div className="flex items-center space-x-2">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
//               disabled={currentPage === 1}
//             >
//               Previous
//             </Button>
//             <div className="flex items-center space-x-1">
//               {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                 const page = i + 1;
//                 return (
//                   <Button
//                     key={page}
//                     variant={currentPage === page ? "default" : "outline"}
//                     size="sm"
//                     onClick={() => setCurrentPage(page)}
//                   >
//                     {page}
//                   </Button>
//                 );
//               })}
//             </div>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
//               disabled={currentPage === totalPages}
//             >
//               Next
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
