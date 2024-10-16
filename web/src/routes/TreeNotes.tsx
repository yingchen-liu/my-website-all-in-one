import HeaderMenu from "../components/Common/HeaderMenu";
import Footer from "../components/Index/Footer";
import { motion } from "framer-motion"; // For animations
import { Button } from "../components/Index/Section";

function TreeNotes() {
  const body = document.body;
  body.style.backgroundColor = "#1f2937";

  return (
    <>
      <HeaderMenu activeItem="tree-notes" />
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-blue-100">
        <div className="container mx-auto max-w-5xl px-5 md:px-10 py-10">
          {/* Main Heading Section */}
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-7xl font-extrabold text-white mb-4">
              TreeNotes
            </h1>
            <h1 className="text-5xl font-extrabold text-white mb-24">
              Organise Your Notes the Smart Way
            </h1>
            <p className="text-xl font-sfmono">
              Say goodbye to clutter and confusion!
            </p>
            <p className="text-xl font-sfmono mb-24">
              Experience the ease of organizing and finding your notes
              effortlessly with a collapsible tree structure.
            </p>

            <p className="text-lg mb-4">
              This is still under development, but you can
            </p>
            <Button href="/tree-notes/my" className="mb-4">
              See My TreeNotes
            </Button>
            <p className="text-lg mb-4">as a preview for now</p>
          </motion.div>

          {/* Image Section */}
          <motion.div
            className="mb-12 flex justify-center"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5 }}
          >
            <img
              src={"/images/tree-notes-tree.png"}
              alt="Tree structure example"
              className="w-3/4 rounded-lg shadow-xl"
            />
          </motion.div>

          {/* Key Features Section */}
          <div className="mb-12">
            <motion.h2
              className="text-3xl font-bold text-white mb-6"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              Key Features
            </motion.h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.li
                className="p-6 bg-gray-700 rounded-lg shadow-md"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <strong>Tree Structure Organization:</strong> Arrange your notes
                in a hierarchical format.
              </motion.li>
              <motion.li
                className="p-6 bg-gray-700 rounded-lg shadow-md"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <strong>Rich Text Editor:</strong> WYSIWYG editor that allows
                you to format your notes as you type.
              </motion.li>
              <motion.li
                className="p-6 bg-gray-700 rounded-lg shadow-md"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <strong>Collapsible Nodes:</strong> Focus only on the
                information you need by collapsing sections.
              </motion.li>
              <motion.li
                className="p-6 bg-gray-700 rounded-lg shadow-md"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                <strong>Easy Navigation:</strong> Quickly find what you're
                looking for with an intuitive tree layout.
              </motion.li>
            </ul>
          </div>

          {/* Rich Text Editor Image */}
          <motion.div
            className="mb-12 flex justify-center"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <img
              src={"/images/tree-notes-editor.png"}
              alt="Rich Text Editor example"
              className="w-3/4 rounded-lg shadow-lg"
            />
          </motion.div>

          {/* Why TreeNotes Section */}
          <div className="mb-16">
            <motion.h2
              className="text-3xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Why TreeNotes?
            </motion.h2>
            <p className="text-lg leading-relaxed">
              Organise complex ideas easily, boost productivity, and personalize
              your notes with rich text formatting options. Perfect for
              students, professionals, and creatives alike.
            </p>
          </div>

          {/* Call to Action */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-lg mb-4">
              This is still under development, but you can
            </p>
            <Button href="/tree-notes/my" className="mb-4">
              See My TreeNotes
            </Button>
            <p className="text-lg mb-4">as a preview for now</p>
          </motion.div>

          <Footer />
        </div>
      </div>
    </>
  );
}

export default TreeNotes;
