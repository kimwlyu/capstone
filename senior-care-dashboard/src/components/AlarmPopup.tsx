// src/components/AlarmPopup.tsx
interface Props {
    message: string;
}

export const AlarmPopup = ({ message }: Props) => {
    if (!message) return null;

    return (
        <div className="fixed bottom-4 right-4 z-30">
            <div className="bg-red-500 text-white text-sm px-4 py-2 rounded-xl shadow-lg">
                {message}
            </div>
        </div>
    );
};
