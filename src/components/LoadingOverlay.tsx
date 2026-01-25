import { ClipLoader } from "react-spinners";

interface LoaderProps {
    loading: boolean
}

export default function FullScreenLoader({ loading }: LoaderProps) {

    if (!loading) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <ClipLoader size={60} />
        </div>
    );

}
