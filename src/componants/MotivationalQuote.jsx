import { useState } from "react";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";

const quotes = [
  {
    text: "The journey of a thousand miles begins with one step. Never give up, because great things take time to build. When you feel like quitting, remember why you started in the first place. Every setback is a setup for a comeback, so keep pushing forward. The road might be long and filled with challenges, but with determination and hard work, you will reach your destination.",
    author: "Lao Tzu",
  },
  {
    text: "Believe in yourself, work hard, and you will succeed. Every obstacle is an opportunity to grow. Challenges are not here to break you, but to make you stronger. Embrace them, learn from them, and use them as stepping stones to your success. Remember, success is not a destination, it’s a journey, and you’re already on the right path. Keep going, and you’ll see the rewards of your efforts.",
    author: "Unknown",
  },
  {
    text: "Success comes not from what you do occasionally, but from what you do consistently. Keep pushing, the results will follow. When you feel like you’re not making progress, remember that small steps forward are still progress. Consistency in your efforts, no matter how small, will lead to big results over time. Trust the process, and keep moving forward with faith and persistence.",
    author: "Unknown",
  },
  {
    text: "Don’t be afraid to start over. This time you’re not starting from scratch, you’re starting from experience. Every new beginning is an opportunity to apply what you’ve learned and grow even more. The past might have its lessons, but it doesn’t define your future. Take everything you’ve learned and use it to create a new chapter, one that will be better than the last. Your future is bright and filled with endless possibilities.",
    author: "Unknown",
  },
  {
    text: "Hardships often prepare ordinary people for an extraordinary destiny. Embrace the struggles, for they make you stronger. Life’s challenges might seem overwhelming at times, but they are often the things that shape us into the best version of ourselves. Don’t let the obstacles discourage you. Instead, let them fuel your growth, because the bigger the challenge, the greater the opportunity for personal transformation.",
    author: "C.S. Lewis",
  },
];

export default function MotivationalQuote() {
  const [quote, setQuote] = useState(
    quotes[Math.floor(Math.random() * quotes.length)]
  );

  const getNewQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  };

  return (
    <section className="m-[50px] shadow-xl  p-8 text-center ">
      <FaQuoteLeft className="text-3xl inline-block mr-2 text-white-100" />
      <p className="text-xl font-semibold inline">{quote.text}</p>
      <FaQuoteRight className="text-3xl inline-block ml-2 text-white-100" />
      <p className="mt-6 text-md font-light">- {quote.author} -</p>
      <div className="relative group">
        <button
          onClick={getNewQuote}
          className="m-4 relative inline-block p-px font-semibold leading-6 text-white bg-neutral-900 shadow-2xl cursor-pointer rounded-2xl shadow-emerald-900 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 hover:shadow-emerald-600"
        >
          <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-sky-600 p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <span className="relative z-10 block px-6 py-3 rounded-2xl bg-neutral-950">
            <div className="relative z-10 flex items-center space-x-3">
              <span className="transition-all duration-500 group-hover:translate-x-1.5 group-hover:text-emerald-300">
                Get Another Quote
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-7 h-7 transition-all duration-500 group-hover:translate-x-1.5 group-hover:text-emerald-300"
              >
                <path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" />
              </svg>
            </div>
          </span>
        </button>
      </div>
    </section>
  );
}
