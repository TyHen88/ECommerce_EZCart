"use client";

import { useState, useEffect } from "react";
import {
  User,
  RefreshCw,
  MessageSquare,
  Bell,
  Percent,
  Wallet,
  HelpCircle,
  LogOut,
  Trash2,
  CheckCircle2,
  Mail,
  Truck,
  Users,
} from "lucide-react";
import useFetchProfile from "@/hooks/useFetchProfile";
import { useRouter } from "next/navigation";
import { performLogout, getAuthToken } from "@/utils/auth";
import SettingSkeleton from "../shared/SettingSkeleton";
import ProfileSettings from "./ProfileSettings";
import OrderHistorySettings from "./OrderHistorySettings";

type MenuItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  variant?: "default" | "destructive";
  action?: () => void;
};

type CollapsibleSection = {
  id: string;
  title: string;
  icon: React.ReactNode;
};

const SettingsContainer = () => {
  const router = useRouter();
  const { data: userInfoData, isLoading } = useFetchProfile();
  const [activeMenu, setActiveMenu] = useState("profile");

  // Check authentication and redirect if not logged in
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push("/auth/login?callbackUrl=/setting&error=AuthenticationRequired");
    }
  }, [router]);
  const sections: CollapsibleSection[] = [
    {
      id: "personal-info",
      title: "Personal Info",
      icon: <User className="w-5 h-5" />,
    },
    {
      id: "security",
      title: "Security",
      icon: <CheckCircle2 className="w-5 h-5" />,
    },
    {
      id: "contact-info",
      title: "Contact Info",
      icon: <Mail className="w-5 h-5" />,
    },
    {
      id: "delivery-address",
      title: "Delivery address",
      icon: <Truck className="w-5 h-5" />,
    },
    {
      id: "interests",
      title: "Interests",
      icon: <Users className="w-5 h-5" />,
    },
    {
      id: "additional-info",
      title: "Additional Info",
      icon: <Users className="w-5 h-5" />,
    },
  ];
  console.log(userInfoData);

  // Form state
  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [nickname, setNickname] = useState("Not specified");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("Female");
  const [country, setCountry] = useState("Ukraine");

  useEffect(() => {
    if (userInfoData?.data) {
      const fullName = userInfoData.data.fullName || "";
      const nameParts = fullName.split(" ");
      setFirstName(nameParts[0] || "");
      setSecondName(nameParts.slice(1).join(" ") || "");
      setNickname(userInfoData.data.username || "Not specified");
    }
  }, [userInfoData]);

  const handleLogout = async () => {
    await performLogout("/");
  };

  const handleDeleteAccount = () => {
    // TODO: Implement delete account functionality
    console.log("Delete account");
  };

  const menuItems: MenuItem[] = [
    { id: "profile", label: "Profile", icon: <User className="w-5 h-5" /> },
    {
      id: "order-history",
      label: "Order History",
      icon: <RefreshCw className="w-5 h-5" />,
    },
    {
      id: "reviews",
      label: "My Reviews",
      icon: <MessageSquare className="w-5 h-5" />,
    },
    {
      id: "offers",
      label: "Personal Offers",
      icon: <Bell className="w-5 h-5" />,
    },
    {
      id: "discounts",
      label: "Discounts and Bonuses",
      icon: <Percent className="w-5 h-5" />,
    },
    { id: "wallet", label: "My Wallet", icon: <Wallet className="w-5 h-5" /> },
    {
      id: "help",
      label: "Help or Complaint",
      icon: <HelpCircle className="w-5 h-5" />,
    },
    {
      id: "logout",
      label: "Log out",
      icon: <LogOut className="w-5 h-5" />,
      action: handleLogout,
    },
    {
      id: "delete",
      label: "Delete Account",
      icon: <Trash2 className="w-5 h-5" />,
      variant: "destructive",
      action: handleDeleteAccount,
    },
  ];

  const userData = userInfoData?.data;
  const profileImageUrl = userData?.profileImageUrl || "/placeholder.svg";

  if (isLoading) return <SettingSkeleton />;

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-7xl">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Sidebar Navigation */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveMenu(item.id);
                  if (item.action) {
                    item.action();
                  }
                }}
                className={`
                                    w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors
                                    ${
                                      activeMenu === item.id
                                        ? "bg-primary text-primary-foreground"
                                        : item.variant === "destructive"
                                        ? "text-destructive hover:bg-destructive/10"
                                        : "hover:bg-accent hover:text-accent-foreground"
                                    }
                                `}
              >
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Right Content Area */}
        <div className="flex-1 min-w-0">
          {activeMenu === "profile" && (
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold mb-2">PERSONAL DATA</h1>
                <p className="text-muted-foreground">
                  Enter your personal data so that you do not have to fill it in
                  manually when placing an order.
                </p>
              </div>

              {/* Collapsible Sections */}
              <ProfileSettings
                sections={sections}
                profileImageUrl={profileImageUrl}
                firstName={firstName}
                secondName={secondName}
                nickname={nickname}
                dateOfBirth={dateOfBirth}
                gender={gender}
                country={country}
                userInfoData={userInfoData}
                setFirstName={setFirstName}
                setSecondName={setSecondName}
                setNickname={setNickname}
                setDateOfBirth={setDateOfBirth}
                setGender={setGender}
                setCountry={setCountry}
              />
            </div>
          )}

          {activeMenu === "order-history" && (
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold mb-2">ORDER HISTORY</h1>
                <p className="text-muted-foreground">
                  View your order history and track your orders.
                </p>
              </div>
              <OrderHistorySettings />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsContainer;
