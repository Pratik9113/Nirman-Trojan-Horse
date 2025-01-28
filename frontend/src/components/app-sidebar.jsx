import { Calendar, Home, Inbox, Search, Settings,Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import React from "react";
import axios from "axios";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { Button } from "./ui/button";

const items = [
  {
    title: "Reads",
    url: "/dashboard/reads",
    icon: Search,
  },
  {
    title: "Add Yours",
    url: "/dashboard/add",
    icon: Inbox,
  },
  {
    title: "chats",
    url: "/dashboard/chat",
    icon: Menu,
  },
  {
    title: "Profile",
    url: "/dashboard/profile",
    icon: Settings,
  },
]

export function AppSidebar() {
  const navigate = useNavigate(); 
  const handleLogout = async() => {
    document.cookie = "UserToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    const response = await axios.post("http://localhost:3000/user/logout", {}, {
      withCredentials: true,
    });
    if (response.request.status === 200) {
      navigate("/");
    }
  };

  return (
    <Sidebar variant="floating">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      onClick={() => {
                        navigate(item.url);
                      }}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {/* Button to logout and navigate to home */}
              <Button onClick={handleLogout}>Logout</Button>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
