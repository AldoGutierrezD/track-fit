import { useEffect, useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler } from "chart.js";
import { Line } from "react-chartjs-2";
import { supabase } from "@/lib/supabase";
import Swal from "sweetalert2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler
);

type Props = {
    labels: string[];
    peso: number[];
}

export default function ProgressChart() {

    const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const [labels, setLabels] = useState<string[]>([]);
    const [values, setValues] = useState<number[]>([]);


    useEffect(() => {
        getData();
    }, []);


    const getData = async () => {

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return;

        const { data, error } = await supabase.rpc(
            "get_usuario_progreso",
            { id_usuariod: user.id }
        );

        if (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Error al obtener los datos para su visualización gráfica"
            });
            return
        }

        const newLabels: string[] = [];
        const newValues: number[] = [];

        data.map((e: { fecha: string; masa: number }) => {
            let month = Number(e.fecha.split("-")[1]) - 1;
            let year = e.fecha.split("-")[0];
            let dateFormat = `${MESES[month]} ${year}`;
            newLabels.push(dateFormat)
            newValues.push(e.masa)
        });

        setLabels(newLabels);
        setValues(newValues);

    }


    const data = {
        labels,
        datasets: [
            {
                label: 'Masa corporal (%)',
                data: values,
                borderColor: "#00c950",
                backgroundColor: "rgba(123, 241, 167, 0.4)",
                tension: 0.4,
                borderWidth: 3,
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 8,
                pointBackgroundColor: "#00c950",
                pointBorderColor: "#fff",
                pointBorderWidth: 2,
            }
        ]
    }

    const options = {
        responsive: true,
        animation: {
            duration: 1800,
            easing: "easeOutQuart" as const
        },
        plugins: {
            legend: { position: 'bottom' as const }
        },
    }

    return <Line data={data} options={options} />

}
