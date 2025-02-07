import React, { useState, useEffect } from "react";
import { Search, ExternalLink, X, Clock, User, Calendar } from "lucide-react";

// API Service
const API_URL = "https://articalss-default-rtdb.firebaseio.com/articles.json";

// Fetch Articles
const fetchArticles = async () => {
  const response = await fetch(API_URL);
  const data = await response.json();
  return data
    ? Object.entries(data).map(([id, article]) => ({ id, ...article }))
    : [];
};

// Article Card Component
const ArticleCard = ({ article, onClick }) => (
  <article
    className="group flex flex-col h-full bg-white rounded-3xl shadow-2xl shadow-gray-500/50 overflow-hidden cursor-pointer w-full max-w-[380px] mx-auto"
    onClick={onClick}
  >
    <div className="relative h-56 overflow-hidden">
      <img
        src={article.author?.imageUrl}
        alt={article.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
    </div>

    <div className="p-6 flex flex-col flex-1">
      <div className="flex-1">
        <div className="flex items-center gap-2 text-indigo-600 text-sm mb-3">
          <Clock className="size-4" />
          <span>5 min read</span>
          <span className="mx-2">•</span>
          <Calendar className="size-4" />
          <span>Today</span>
        </div>

        <h3 className="text-xl font-bold text-gray-800 text-left mb-3 group-hover:text-indigo-600 transition-colors">
          {article.title || "optimize"}
        </h3>
        <p className="text-gray-600 text-right line-clamp-3 leading-relaxed">
          {article.description || "وصف غير متوفر"}
        </p>
      </div>

      <button
        className="mt-6 w-full px-6 py-3.5 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl font-medium transition-all duration-300 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg hover:shadow-indigo-500/25 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center gap-2"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <span>Read More</span>
        <ExternalLink className="size-4" />
      </button>
    </div>
  </article>
);

// Search Bar Component
const SearchBar = ({ value, onChange }) => (
  <div className="relative w-full max-w-lg">
    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-2xl blur-2xl" />
    <div className="relative flex items-center bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-4 border border-white/20">
      <Search className="text-indigo-600 w-6 h-6 ml-3" />
      <input
        type="text"
        placeholder="Search for articles."
        className="w-full outline-none bg-transparent text-left ml-3 placeholder:text-gray-500 text-gray-700"
        value={value}
        onChange={onChange}
      />
    </div>
  </div>
);

// Modal Component
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full m-4 transform transition-all duration-500 animate-fadeIn">
        {children}
      </div>
    </div>
  );
};

// Article Modal Content
const ArticleModalContent = ({ article, onClose }) => (
  <>
    <div className="relative h-64 overflow-hidden rounded-t-3xl">
      <img
        src={article.author?.imageUrl}
        alt={article.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />

      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-md rounded-full transition-colors hover:bg-white/20"
      >
        <X className="size-5 text-white" />
      </button>

      <div className="absolute bottom-0 inset-x-0 p-8">
        <h2 className="text-3xl font-bold text-white text-right mb-2">
          {article.title}
        </h2>
        <div className="flex items-center justify-end gap-4">
          {article.author?.imageUrl && (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-semibold text-white">
                  {article.author.name}
                </p>
                <p className="text-sm text-white/75">كاتب المقال</p>
              </div>
              <img
                src={article.author.imageUrl}
                alt={article.author.name}
                className="size-12 rounded-full ring-2 ring-white/50"
              />
            </div>
          )}
        </div>
      </div>
    </div>

    <div className="p-8">
      <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Clock className="size-3" />
          <span>5 min read</span>
        </div>
        <div className="size-1.5 bg-gray-300 rounded-full" />
        <div className="flex items-center gap-2">
          <Calendar className="size-4" />
          <span>Published today</span>
        </div>
        <div className="size-1.5 bg-gray-300 rounded-full" />
        <div className="flex items-center gap-2">
          <User className="size-4" />
          <span>By {article.author?.name}</span>
        </div>
      </div>

      <p className="text-gray-700 text-left leading-relaxed text-lg">
        {article.description}
      </p>

      <div className="flex justify-end gap-4 border-t pt-8 mt-8">
        <button
          onClick={onClose}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium transition-all duration-300 hover:bg-gray-200 hover:shadow-lg"
        >
          Close
        </button>
        <a
          href={article.href || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5 flex items-center gap-2"
        >
          <span>Visit Site</span>
          <ExternalLink className="size-4" />
        </a>
      </div>
    </div>
  </>
);

// Main Articles Component
const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const data = await fetchArticles();
        setArticles(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  const filteredArticles = articles.filter(
    (article) =>
      (article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())) &&
      article.title &&
      article.description
  );

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
          <div className="animate-spin size-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">حدث خطأ: {error}</p>
      </div>
    );

  return (
    <div className="space-y-8">
      {/* Section for the image with search bar */}
      <section className="relative h-100 flex flex-col items-center justify-center text-center">
        <img
          src="//unsplash.it/1080" // قم بتغيير الرابط إلى رابط الصورة الخاصة بك
          alt="About Us"
          className="w-full h-full object-cover absolute inset-0 opacity-40"
        />
        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-black mb-4">
            Explore the Latest Articles
          </h2>
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-30 mt-20">
        {filteredArticles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            onClick={() => setSelectedArticle(article)}
          />
        ))}
      </div>

      {selectedArticle && (
        <Modal isOpen={true} onClose={() => setSelectedArticle(null)}>
          <ArticleModalContent
            article={selectedArticle}
            onClose={() => setSelectedArticle(null)}
          />
        </Modal>
      )}
    </div>
  );
};

export default Articles;