import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaGreaterThan } from "react-icons/fa";
import { getAuctionDetail } from "@/store/slices/auctionSlice";
import { RiAuctionFill } from "react-icons/ri";
import Spinner from "@/custom-components/Spinner";
import { placeBid } from "@/store/slices/bidSlice";
import { FiShare2 } from "react-icons/fi";
import { FaWhatsapp, FaTwitter, FaFacebook, FaEnvelope } from "react-icons/fa";

const AuctionItem = () => {
  const { id } = useParams();
  const { loading, auctionDetail, auctionBidders } = useSelector((state) => state.auction);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  const [amount, setAmount] = useState("");
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const baseUrl = window.location.origin || "http://localhost:3000";
  const auctionUrl =
    user?.role === "Bidder" || !user
      ? `${baseUrl}/auction/item/${id}`
      : `${baseUrl}/auction/details/${id}`;

  const handleBid = () => {
    const formData = new FormData();
    formData.append("amount", amount);
    dispatch(placeBid(id, formData));
    dispatch(getAuctionDetail(id));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: auctionDetail.title,
          url: auctionUrl,
        })
        .catch((err) => console.log("Share failed:", err));
    } else {
      setShowShareMenu(!showShareMenu);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(auctionUrl);
    setCopied(true);
    setShowShareMenu(false);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigateTo("/");
    }
    if (id) {
      dispatch(getAuctionDetail(id));
    }
  }, [isAuthenticated, id, dispatch, navigateTo]);

  return (
    <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col">
      <div className="text-[16px] flex flex-wrap gap-2 items-center">
        <Link
          to="/"
          className="font-semibold transition-all duration-300 hover:text-[#D6482B]"
        >
          Home
        </Link>
        <FaGreaterThan className="text-stone-400" />
        <Link
          to={"/auctions"}
          className="font-semibold transition-all duration-300 hover:text-[#D6482B]"
        >
          Auctions
        </Link>
        <FaGreaterThan className="text-stone-400" />
        <p className="text-stone-600">{auctionDetail.title}</p>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="flex gap-4 flex-col lg:flex-row relative">
          <div className="flex-1 flex flex-col gap-3">
            <div className="flex gap-4 flex-col lg:flex-row">
              <div className="bg-white w-[100%] lg:w-40 lg:h-40 flex justify-center items-center p-5">
                <img
                  src={auctionDetail.image?.url}
                  alt={auctionDetail.title}
                />
              </div>
              <div className="flex flex-col justify-around pb-4">
                <h3 className="text-[#111] text-xl font-semibold mb-2 min-[480px]:text-xl md:text-2xl lg:text-3xl">
                  {auctionDetail.title}
                </h3>
                <p className="text-xl font-semibold">
                  Condition:{" "}
                  <span className="text-[#D6482B]">{auctionDetail.condition}</span>
                </p>
                <p className="text-xl font-semibold">
                  Minimum Bid:{" "}
                  <span className="text-[#D6482B]">Rs.{auctionDetail.startingBid}</span>
                </p>
              </div>
            </div>
            <p className="text-xl w-fit font-bold">Auction Item Description</p>
            <hr className="my-2 border-t-[1px] border-t-stone-700" />
            {auctionDetail.description &&
              auctionDetail.description.split(". ").map((element, index) => (
                <li key={index} className="text-[18px] my-2">
                  {element}
                </li>
              ))}
          </div>
          <div className="flex-1">
            <header className="bg-stone-200 py-4 text-[24px] font-semibold px-4 flex justify-between items-center">
              BIDS
              <button
                onClick={handleShare}
                className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                title="Share this auction"
              >
                <FiShare2 className="text-gray-600" />
              </button>
            </header>
            {copied && (
              <span className="absolute top-16 right-4 bg-green-500 text-white text-xs px-2 py-1 rounded">
                Link copied!
              </span>
            )}
            {showShareMenu && !navigator.share && (
              <div className="absolute top-16 right-4 bg-white shadow-lg rounded-lg p-2 z-10">
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 w-full text-left"
                >
                  <FaEnvelope /> Copy Link
                </button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(auctionUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 w-full"
                >
                  <FaWhatsapp /> WhatsApp
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(auctionUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 w-full"
                >
                  <FaTwitter /> Twitter
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(auctionUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 w-full"
                >
                  <FaFacebook /> Facebook
                </a>
              </div>
            )}
            <div className="bg-white px-4 min-h-fit lg:min-h-[650px]">
              {auctionBidders && new Date(auctionDetail.startTime) < Date.now() && new Date(auctionDetail.endTime) > Date.now() ? (
                auctionBidders.length > 0 ? (
                  auctionBidders.map((element, index) => (
                    <div key={index} className="py-2 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img
                          src={element.profileImage}
                          alt={element.username}
                          className="w-12 h-12 rounded-full my-2 hidden md:block"
                        />
                        <p className="text-[18px] font-semibold">{element.username}</p>
                      </div>
                      {index === 0 ? (
                        <p className="text-[20px] font-semibold text-green-600">1st</p>
                      ) : index === 1 ? (
                        <p className="text-[20px] font-semibold text-blue-600">2nd</p>
                      ) : index === 2 ? (
                        <p className="text-[20px] font-semibold text-yellow-600">3rd</p>
                      ) : (
                        <p className="text-[20px] font-semibold text-gray-600">{index + 1}th</p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">No bids for this auction</p>
                )
              ) : Date.now() < new Date(auctionDetail.startTime) ? (
                <img src="/notStarted.png" alt="not-started" className="w-full max-h-[650px]" />
              ) : (
                <img src="/auctionEnded.png" alt="ended" className="w-full max-h-[650px]" />
              )}
            </div>
            <div className="bg-[#D6482B] py-4 text-[16px] md:text-[24px] font-semibold px-4 flex items-center justify-between">
              {Date.now() >= new Date(auctionDetail.startTime) && Date.now() <= new Date(auctionDetail.endTime) ? (
                <>
                  <div className="flex gap-3 flex-col sm:flex-row sm:items-center">
                    <p className="text-white">Place Bid</p>
                    <input
                      type="number"
                      className="w-32 focus:outline-none md:text-[20px] p-1"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                  <button
                    className="p-4 text-white bg-black rounded-full transition-all duration-300 hover:bg-[#222]"
                    onClick={handleBid}
                  >
                    <RiAuctionFill />
                  </button>
                </>
              ) : new Date(auctionDetail.startTime) > Date.now() ? (
                <p className="text-white font-semibold text-xl">Auction has not started yet!</p>
              ) : (
                <p className="text-white font-semibold text-xl">Auction has ended!</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AuctionItem;