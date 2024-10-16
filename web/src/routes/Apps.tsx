import { useNavigate } from "react-router-dom";
import HeaderMenu from "../components/Common/HeaderMenu";
import "./Apps.css";

function Apps() {
  const body = document.body;
  body.style.backgroundColor = "#1f2937";

  const navigate = useNavigate();

  return (
    <>
      <HeaderMenu activeItem="apps" />

      <div className="bg-gray-800 text-blue-100 mt-10">
        <div className="container mx-auto max-w-5xl px-5 md:px-10 flex gap-5">
          <div
            className="relative text-center border-white border p-5 rounded-md w-1/2 md:w-1/4 cursor-pointer hover:shadow-2xl tree-container"
            onClick={() => navigate("/tree-notes")}
          >
            {/* Tree */}
            <div className="text-9xl mb-4 tree-shake">🌲</div>

            {/* Fruits */}
            <div className="absolute inset-0 flex items-center justify-center drop-fruit">
              <div className="text-lg ml-[0px] mt-[-50px]">🍎</div>
              <div className="text-lg ml-[-15px] mt-[-30px]">🍊</div>
              <div className="text-lg ml-[8px] mt-[-90px]">🍋</div>
              <div className="text-lg ml-[-5px] mt-[-40px]">🍇</div>
              <div className="text-lg ml-[-3px] mt-[-15px]">🍓</div>
              <div className="text-lg ml-[-30px] mt-[-45px]">🍉</div>
            </div>

            <div className="text-xl">TreeNotes</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Apps;
