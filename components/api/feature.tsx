import type { Service, ServiceTag } from "@/types/feature";

export async function getListServices(): Promise<{ services: Service[]; tags: ServiceTag[] }> {
    try {
        const [serviceRes, tagRes] = await Promise.all([
            fetch("https://localhost:7277/api/service/list-services", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            }),
            fetch("https://localhost:7277/api/filter/service-tags", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            }),
        ]);

        if (!serviceRes.ok) throw new Error("Failed to fetch services");
        if (!tagRes.ok) throw new Error("Failed to fetch tags");

        const serviceResult = await serviceRes.json();
        const tagResult = await tagRes.json();

        console.log("API Response - Services:", serviceResult);
        console.log("API Response - Tags:", tagResult);

        const services = serviceResult.data.map((item: any) => ({
            ...item,
            serviceImageUrl: Array.isArray(item.serviceImageUrl) ? item.serviceImageUrl : [item.serviceImageUrl || "/placeholder.svg"],
            serviceTags: item.serviceTags || null,
        })) as Service[];

        const tags = tagResult.data || [];

        return { services, tags };
    } catch (err) {
        console.error("Error fetching data:", err);
        throw err;
    }
}