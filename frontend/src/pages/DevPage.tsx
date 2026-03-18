import React from "react";

const componentCategories = [
  {
    category: "Forms",
    items: ["UITextInput", "UICheckbox", "UIButton", "UIErrorMessage"],
  },
  {
    category: "Navigation",
    items: ["UINavbar", "UILink", "UIIconButton"],
  },
  {
    category: "Layout",
    items: ["UICard", "UIChatBubble", "UIEmailDetail", "UITypingIndicator"],
  },
  {
    category: "Pages",
    items: ["HomePage", "LoginPage", "EmailPage", "AIChatPage", "NotesPage", "CreateAccountPage"],
  },
];

function DevPage(): React.ReactElement {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Developer Component Catalog</h1>
      <p className="text-sm text-gray-400">This page shows all major UI components by category and offers a quick dev/workflow overview.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {componentCategories.map((section) => (
          <div key={section.category} className="rounded-xl border border-[#7c3aed] bg-[#111827] p-4">
            <h2 className="text-lg font-semibold text-[#d8b4fe]">{section.category}</h2>
            <ul className="mt-2 list-disc list-inside text-sm text-gray-200">
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DevPage;
