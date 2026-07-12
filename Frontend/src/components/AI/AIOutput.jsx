import { Copy, Check } from "lucide-react";
import { useState } from "react";

function AIOutput({ output }) {

    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {

        await navigator.clipboard.writeText(output);

        setCopied(true);

        setTimeout(() => {

            setCopied(false);

        }, 2000);

    };

    if (!output) {

        return (

            <div
                className="
                    rounded-2xl

                    border

                    border-dashed

                    border-slate-700

                    p-12

                    text-center

                    text-slate-500
                "
            >

                AI output will appear here.

            </div>

        );

    }

    return (

        <div
            className="
                rounded-2xl

                border

                border-slate-700

                bg-slate-900/50

                p-6
            "
        >

            <div className="flex justify-end mb-4">

                <button

                    onClick={handleCopy}

                    className="
                        flex

                        items-center

                        gap-2

                        rounded-xl

                        bg-cyan-600

                        px-4

                        py-2

                        text-white

                        hover:bg-cyan-500
                    "

                >

                    {

                        copied

                            ?

                            <Check size={16}/>

                            :

                            <Copy size={16}/>

                    }

                    {

                        copied

                            ?

                            "Copied"

                            :

                            "Copy"

                    }

                </button>

            </div>

            <pre
                className="
                    whitespace-pre-wrap

                    text-sm

                    text-slate-200

                    leading-7
                "
            >

                {output}

            </pre>

        </div>

    );

}

export default AIOutput;