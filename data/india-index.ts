/**
 * data/india-index.ts — CANONICAL list of Indian states/UTs and the cities that get pages.
 * Owned by the integration owner. `data/states.ts` and `data/cities.ts` must use exactly these
 * slugs/names. To add a city: add it here first, then add its entry in data/cities.ts.
 * tier: large = 8 cities, medium = 4, ne = 2 (north-east), small = 1–2 (small UTs).
 */
import type { Region } from "./types";

export interface IndiaIndexEntry {
  slug: string;
  name: string;
  type: "state" | "ut";
  tier: "large" | "medium" | "ne" | "small";
  region: Region;
  capital: string;
  cities: { slug: string; name: string; isTop?: boolean }[];
}

const c = (name: string, slug?: string, isTop?: boolean) => ({
  name,
  slug: slug ?? name.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
  ...(isTop ? { isTop } : {}),
});

export const indiaIndex: IndiaIndexEntry[] = [
  // ---- Large industrial states (8 cities) ----
  { slug: "maharashtra", name: "Maharashtra", type: "state", tier: "large", region: "West", capital: "Mumbai",
    cities: [c("Mumbai", undefined, true), c("Pune", undefined, true), c("Nashik"), c("Chhatrapati Sambhajinagar (Aurangabad)", "aurangabad"), c("Nagpur"), c("Kolhapur"), c("Solapur"), c("Thane")] },
  { slug: "gujarat", name: "Gujarat", type: "state", tier: "large", region: "West", capital: "Gandhinagar",
    cities: [c("Ahmedabad", undefined, true), c("Rajkot", undefined, true), c("Surat"), c("Vadodara"), c("Jamnagar"), c("Bhavnagar"), c("Morbi"), c("Anand")] },
  { slug: "tamil-nadu", name: "Tamil Nadu", type: "state", tier: "large", region: "South", capital: "Chennai",
    cities: [c("Chennai", undefined, true), c("Coimbatore", undefined, true), c("Tiruchirappalli"), c("Madurai"), c("Hosur"), c("Salem"), c("Tiruppur"), c("Erode")] },
  { slug: "karnataka", name: "Karnataka", type: "state", tier: "large", region: "South", capital: "Bengaluru",
    cities: [c("Bengaluru", undefined, true), c("Hubballi"), c("Belagavi"), c("Mysuru"), c("Mangaluru"), c("Tumakuru"), c("Shivamogga"), c("Davanagere")] },
  { slug: "uttar-pradesh", name: "Uttar Pradesh", type: "state", tier: "large", region: "North", capital: "Lucknow",
    cities: [c("Noida", undefined, true), c("Ghaziabad"), c("Kanpur"), c("Lucknow"), c("Agra"), c("Meerut"), c("Aligarh"), c("Varanasi")] },
  { slug: "punjab", name: "Punjab", type: "state", tier: "large", region: "North", capital: "Chandigarh",
    cities: [c("Ludhiana", undefined, true), c("Jalandhar"), c("Amritsar"), c("Mohali"), c("Patiala"), c("Bathinda"), c("Mandi Gobindgarh"), c("Rajpura")] },
  { slug: "haryana", name: "Haryana", type: "state", tier: "large", region: "North", capital: "Chandigarh",
    cities: [c("Gurugram"), c("Faridabad", undefined, true), c("Manesar"), c("Panipat"), c("Sonipat"), c("Bahadurgarh"), c("Ambala"), c("Yamunanagar")] },
  { slug: "rajasthan", name: "Rajasthan", type: "state", tier: "large", region: "North", capital: "Jaipur",
    cities: [c("Jaipur"), c("Jodhpur"), c("Udaipur"), c("Kota"), c("Bhiwadi"), c("Alwar"), c("Bhilwara"), c("Ajmer")] },
  { slug: "west-bengal", name: "West Bengal", type: "state", tier: "large", region: "East", capital: "Kolkata",
    cities: [c("Kolkata"), c("Howrah", undefined, true), c("Durgapur"), c("Asansol"), c("Haldia"), c("Siliguri"), c("Kharagpur"), c("Bardhaman")] },
  { slug: "delhi", name: "Delhi", type: "ut", tier: "large", region: "North", capital: "New Delhi",
    cities: [c("Okhla"), c("Bawana"), c("Narela"), c("Mayapuri"), c("Wazirpur"), c("Naraina"), c("Patparganj"), c("Badli")] },
  { slug: "telangana", name: "Telangana", type: "state", tier: "large", region: "South", capital: "Hyderabad",
    cities: [c("Hyderabad", undefined, true), c("Patancheru"), c("Medchal"), c("Warangal"), c("Karimnagar"), c("Nizamabad"), c("Khammam"), c("Mahbubnagar")] },
  { slug: "andhra-pradesh", name: "Andhra Pradesh", type: "state", tier: "large", region: "South", capital: "Amaravati",
    cities: [c("Visakhapatnam"), c("Vijayawada"), c("Guntur"), c("Tirupati"), c("Nellore"), c("Kakinada"), c("Kurnool"), c("Anantapur")] },
  { slug: "madhya-pradesh", name: "Madhya Pradesh", type: "state", tier: "large", region: "Central", capital: "Bhopal",
    cities: [c("Indore"), c("Bhopal"), c("Pithampur"), c("Jabalpur"), c("Gwalior"), c("Dewas"), c("Ujjain"), c("Satna")] },
  { slug: "kerala", name: "Kerala", type: "state", tier: "large", region: "South", capital: "Thiruvananthapuram",
    cities: [c("Kochi"), c("Thiruvananthapuram"), c("Kozhikode"), c("Thrissur"), c("Kollam"), c("Palakkad"), c("Kannur"), c("Alappuzha")] },
  // ---- Medium states / UTs (4 cities) ----
  { slug: "assam", name: "Assam", type: "state", tier: "medium", region: "North-East", capital: "Dispur",
    cities: [c("Guwahati"), c("Dibrugarh"), c("Silchar"), c("Tinsukia")] },
  { slug: "bihar", name: "Bihar", type: "state", tier: "medium", region: "East", capital: "Patna",
    cities: [c("Patna"), c("Muzaffarpur"), c("Bhagalpur"), c("Gaya")] },
  { slug: "chhattisgarh", name: "Chhattisgarh", type: "state", tier: "medium", region: "Central", capital: "Raipur",
    cities: [c("Raipur"), c("Bhilai"), c("Bilaspur"), c("Korba")] },
  { slug: "goa", name: "Goa", type: "state", tier: "medium", region: "West", capital: "Panaji",
    cities: [c("Verna"), c("Panaji"), c("Margao"), c("Vasco da Gama")] },
  { slug: "himachal-pradesh", name: "Himachal Pradesh", type: "state", tier: "medium", region: "North", capital: "Shimla",
    cities: [c("Baddi"), c("Nalagarh"), c("Parwanoo"), c("Una")] },
  { slug: "jharkhand", name: "Jharkhand", type: "state", tier: "medium", region: "East", capital: "Ranchi",
    cities: [c("Jamshedpur"), c("Ranchi"), c("Bokaro"), c("Dhanbad")] },
  { slug: "odisha", name: "Odisha", type: "state", tier: "medium", region: "East", capital: "Bhubaneswar",
    cities: [c("Bhubaneswar"), c("Cuttack"), c("Rourkela"), c("Angul")] },
  { slug: "uttarakhand", name: "Uttarakhand", type: "state", tier: "medium", region: "North", capital: "Dehradun",
    cities: [c("Haridwar"), c("Rudrapur"), c("Dehradun"), c("Roorkee")] },
  { slug: "jammu-and-kashmir", name: "Jammu and Kashmir", type: "ut", tier: "medium", region: "North", capital: "Srinagar / Jammu",
    cities: [c("Jammu"), c("Srinagar"), c("Kathua"), c("Samba")] },
  // ---- North-eastern states (2 cities) ----
  { slug: "arunachal-pradesh", name: "Arunachal Pradesh", type: "state", tier: "ne", region: "North-East", capital: "Itanagar",
    cities: [c("Itanagar"), c("Naharlagun")] },
  { slug: "manipur", name: "Manipur", type: "state", tier: "ne", region: "North-East", capital: "Imphal",
    cities: [c("Imphal"), c("Thoubal")] },
  { slug: "meghalaya", name: "Meghalaya", type: "state", tier: "ne", region: "North-East", capital: "Shillong",
    cities: [c("Shillong"), c("Byrnihat")] },
  { slug: "mizoram", name: "Mizoram", type: "state", tier: "ne", region: "North-East", capital: "Aizawl",
    cities: [c("Aizawl"), c("Lunglei")] },
  { slug: "nagaland", name: "Nagaland", type: "state", tier: "ne", region: "North-East", capital: "Kohima",
    cities: [c("Dimapur"), c("Kohima")] },
  { slug: "sikkim", name: "Sikkim", type: "state", tier: "ne", region: "North-East", capital: "Gangtok",
    cities: [c("Gangtok"), c("Rangpo")] },
  { slug: "tripura", name: "Tripura", type: "state", tier: "ne", region: "North-East", capital: "Agartala",
    cities: [c("Agartala"), c("Udaipur (Tripura)", "udaipur-tripura")] },
  // ---- Small UTs (1–2 cities) ----
  { slug: "chandigarh", name: "Chandigarh", type: "ut", tier: "small", region: "North", capital: "Chandigarh",
    cities: [c("Chandigarh")] },
  { slug: "puducherry", name: "Puducherry", type: "ut", tier: "small", region: "South", capital: "Puducherry",
    cities: [c("Puducherry"), c("Karaikal")] },
  { slug: "ladakh", name: "Ladakh", type: "ut", tier: "small", region: "North", capital: "Leh",
    cities: [c("Leh")] },
  { slug: "andaman-and-nicobar-islands", name: "Andaman and Nicobar Islands", type: "ut", tier: "small", region: "South", capital: "Port Blair",
    cities: [c("Port Blair")] },
  { slug: "lakshadweep", name: "Lakshadweep", type: "ut", tier: "small", region: "South", capital: "Kavaratti",
    cities: [c("Kavaratti")] },
  { slug: "dadra-and-nagar-haveli-and-daman-and-diu", name: "Dadra and Nagar Haveli and Daman and Diu", type: "ut", tier: "small", region: "West", capital: "Daman",
    cities: [c("Silvassa"), c("Daman")] },
];

export const indiaStateCount = indiaIndex.length; // 36
export const indiaCityCount = indiaIndex.reduce((n, s) => n + s.cities.length, 0);
