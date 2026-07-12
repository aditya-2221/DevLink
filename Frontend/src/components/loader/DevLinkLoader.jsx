import {

    motion,

    AnimatePresence

} from "framer-motion";

import { useEffect, useMemo, useState } from "react";

import logo from "../../assets/circleLogo.png";

import {

    loaderMessages,

    loaderSteps,

    MESSAGE_DURATION

} from "./LoaderData";

export default function DevLinkLoader({

    progress = 0

}) {

    const [

        messageIndex,

        setMessageIndex

    ] = useState(0);

    const [

        displayProgress,

        setDisplayProgress

    ] = useState(0);

    const [

        currentStep,

        setCurrentStep

    ] = useState(0);
    useEffect(() => {

        const interval = setInterval(() => {

            setMessageIndex((prev) =>

                (prev + 1) %

                loaderMessages.length

            );

        }, MESSAGE_DURATION);

        return () => clearInterval(interval);

    }, []);
    useEffect(() => {

        const timer = setInterval(() => {

            setDisplayProgress((prev) => {

                if (prev >= progress)

                    return prev;

                return prev + 1;

            });

        }, 20);

        return () => clearInterval(timer);

    }, [progress]);
    useEffect(() => {

        const step = Math.min(

            loaderSteps.length - 1,

            Math.floor(

                displayProgress / 20

            )

        );

        setCurrentStep(step);

    }, [displayProgress]);

    const particles = useMemo(
        () =>
            Array.from({ length: 40 }, () => ({
                left: Math.random() * 100,
                top: Math.random() * 100,
                size: Math.random() * 3 + 2,
                duration: Math.random() * 6 + 6,
                delay: Math.random() * 6
            })),
        []
    );
    return (

        <motion.div

            initial={{

                opacity: 0

            }}

            animate={{

                opacity: 1

            }}

            exit={{

                opacity: 0

            }}

            transition={{

                duration: 0.5

            }}

            className="

fixed

inset-0

z-[99999]

overflow-hidden

bg-[#050B1D]

flex

items-center

justify-center

"

        >



            <motion.div
                className="
    absolute

    w-[1200px]
    h-[1200px]

    rounded-full

    bg-[#2563EB]/20

    blur-[220px]
    "

                animate={{
                    scale: [1, 1.08, 1],
                    opacity: [0.4, 0.7, 0.4]
                }}

                transition={{
                    duration: 6,
                    repeat: Infinity
                }}
            />
            <div
                className="
absolute

top-0
left-1/2

-translate-x-1/2

w-[900px]
h-[400px]

bg-cyan-500/10

blur-[180px]
"
            />
            <div
                className="
absolute

bottom-[-250px]
left-1/2

-translate-x-1/2

w-[1000px]
h-[500px]

bg-blue-700/15

blur-[220px]
"
            />
            <motion.div

                className="
absolute

inset-0

opacity-20

bg-[linear-gradient(rgba(59,130,246,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,.05)_1px,transparent_1px)]

bg-[size:48px_48px]
"

                animate={{

                    backgroundPosition: [

                        "0px 0px",

                        "48px 48px"

                    ]

                }}

                transition={{

                    duration: 12,

                    repeat: Infinity,

                    ease: "linear"

                }}

            />
            <div

                className="
absolute

inset-0

bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,.7)_100%)]

"
            />
            <div
                className="
    absolute
    inset-0

    opacity-30

    bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)]

    bg-[size:45px_45px]
    "
            />

            <motion.div

                className="
    absolute
    inset-0

    opacity-20

    bg-[linear-gradient(rgba(34,211,238,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.08)_1px,transparent_1px)]

    bg-[size:45px_45px]
    "

                animate={{

                    backgroundPosition: [

                        "0px 0px",

                        "45px 45px"

                    ]

                }}

                transition={{

                    duration: 10,

                    repeat: Infinity,

                    ease: "linear"

                }}

            />
            <div

                className="

relative

w-full

max-w-xl

px-8

flex

flex-col

items-center

"

            >
                <div className="relative flex items-center justify-center w-[380px] h-[380px]">

                    {/* Orbit */}

                    <motion.div
                        className="
        absolute
        inset-0

        rounded-full

        border

        border-cyan-400/10
        "
                        animate={{
                            rotate: 360
                        }}
                        transition={{
                            duration: 18,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    >

                        {[0, 90, 180, 270].map((angle, index) => (

                            <motion.div
                                key={index}
                                className="
                absolute

                w-3
                h-3

                rounded-full

                bg-cyan-400

                shadow-[0_0_20px_#38BDF8]
                "
                                style={{
                                    left: "50%",
                                    top: "50%",
                                    transform: `
                        rotate(${angle}deg)
                        translateY(-310px)
                    `
                                }}
                                animate={{
                                    scale: [1, 1.8, 1],
                                    opacity: [.5, 1, .5]
                                }}
                                transition={{
                                    duration: 2.5,
                                    repeat: Infinity,
                                    delay: index * .3
                                }}
                            />

                        ))}

                    </motion.div>

                    {/* Logo */}

                    <motion.img
                        src={logo}
                        alt="DevLink"
                        className="
        relative

        w-[320px]

        z-10

        select-none
        pointer-events-none
        "
                        initial={{
                            opacity: 0,
                            scale: .8
                        }}
                        animate={{
                            opacity: 1,
                            scale: [1, 1.03, 1]
                        }}
                        transition={{
                            opacity: {
                                duration: .8
                            },
                            scale: {
                                duration: 2.5,
                                repeat: Infinity
                            }
                        }}
                    />

                </div>
                <div className="absolute inset-0 pointer-events-none overflow-hidden">

                    {particles.map((particle, index) => (

                        <motion.div
                            key={index}
                            className="absolute rounded-full bg-cyan-400"

                            style={{
                                left: `${particle.left}%`,
                                top: `${particle.top}%`,
                                width: particle.size,
                                height: particle.size
                            }}

                            animate={{
                                opacity: [0.15, 1, 0.15],
                                scale: [1, 2, 1]
                            }}

                            transition={{
                                duration: particle.duration,
                                delay: particle.delay,
                                repeat: Infinity
                            }}
                        />

                    ))}

                </div>
                <div className="mt-10 flex items-center gap-3">

                    <motion.span

                        animate={{

                            opacity: [.4, 1, .4]

                        }}

                        transition={{

                            duration: 1.5,

                            repeat: Infinity

                        }}

                        className="text-cyan-400"

                    >

                        {"</>"}

                    </motion.span>

                    <AnimatePresence mode="wait">

                        <motion.h2

                            key={messageIndex}

                            initial={{

                                opacity: 0,

                                y: 10

                            }}

                            animate={{

                                opacity: 1,

                                y: 0

                            }}

                            exit={{

                                opacity: 0,

                                y: -10

                            }}

                            transition={{

                                duration: .35

                            }}

                            className="

text-xl

font-medium

text-slate-200

"

                        >

                            {

                                loaderMessages[messageIndex]

                            }

                        </motion.h2>

                    </AnimatePresence>

                </div>
                <div className="w-full mt-8">

                    <div

                        className="
relative

h-4

rounded-full

overflow-hidden

bg-slate-800

border

border-cyan-500/20

"

                    >

                        <motion.div

                            className="
absolute

left-0

top-0

h-full

rounded-full

bg-gradient-to-r

from-cyan-400

via-blue-500

to-violet-500

shadow-[0_0_30px_#3B82F6]

"

                            animate={{

                                width: `${displayProgress}%`

                            }}

                            transition={{

                                duration: .25

                            }}

                        />

                    </div>

                    <div className="flex justify-end mt-2">

                        <span className="text-cyan-400">

                            {displayProgress}%

                        </span>

                    </div>

                </div>
                <div className="mt-12 w-full">

                    <div className="flex justify-between items-center">

                        {loaderSteps.map((step, index) => {

                            const Icon = step.icon;

                            const active = currentStep >= index;

                            return (

                                <div
                                    key={step.label}
                                    className="flex flex-col items-center flex-1"
                                >

                                    <motion.div

                                        animate={{

                                            scale: active
                                                ? [1, 1.15, 1]
                                                : 1,

                                            opacity: active
                                                ? 1
                                                : .35

                                        }}

                                        transition={{

                                            duration: .5

                                        }}

                                        className={`
                            w-14
                            h-14
                            rounded-full

                            flex
                            items-center
                            justify-center

                            border

                            transition-all

                            ${active

                                                ?

                                                "border-cyan-400 bg-cyan-500/10 shadow-[0_0_25px_rgba(34,211,238,.35)]"

                                                :

                                                "border-slate-700 bg-slate-900"

                                            }
                        `}

                                    >

                                        <Icon
                                            size={24}
                                            className={
                                                active
                                                    ? "text-cyan-400"
                                                    : "text-slate-500"
                                            }
                                        />

                                    </motion.div>

                                    <span
                                        className={`
                            mt-4
                            text-xs
                            tracking-widest

                            ${active
                                                ? "text-white"
                                                : "text-slate-500"
                                            }
                        `}
                                    >

                                        {step.label}

                                    </span>

                                </div>

                            );

                        })}

                    </div>

                </div>
                <motion.div

                    className="
    mt-12

    px-8
    py-4

    rounded-2xl

    border

    border-cyan-500/20

    bg-slate-900/70

    flex

    items-center

    gap-4

    backdrop-blur-xl
    "

                    animate={{

                        y: [0, -5, 0]

                    }}

                    transition={{

                        duration: 2,

                        repeat: Infinity

                    }}

                >

                    <motion.div

                        animate={{

                            rotate: 360

                        }}

                        transition={{

                            duration: 6,

                            repeat: Infinity,

                            ease: "linear"

                        }}

                        className="text-cyan-400"

                    >

                        🚀

                    </motion.div>

                    <span
                        className="
        text-slate-300
        "
                    >

                        Almost there,

                        <span className="text-cyan-400">

                            {" "}preparing your workspace...

                        </span>

                    </span>

                </motion.div>
            </div>

        </motion.div>

    );
}