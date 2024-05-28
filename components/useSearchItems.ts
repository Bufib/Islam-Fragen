interface Item {
  id: number;
  title: string;
  answer?: string;
  answer_sistani?: string;
  answer_khamenei?: string;
  question: string;
  tableName: string; // Add tableName to store the category name
}

interface TopCategoryItem {
  id: number;
  title: string;
  questions?: Item[]; // Ensure this matches the actual data structure
}

import { useState, useEffect } from "react";
import useFetchSubCategories from "components/useFetchSubCategories";

const useSearchItems = (search: string) => {
  const [searchResults, setSearchResults] = useState<Item[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { subCategories, isFetching } = useFetchSubCategories();

  useEffect(() => {
    const fetchData = async () => {
      if (!subCategories) {
        setFetchError("Failed to fetch subcategories");
        setIsLoading(false);
        return;
      }

      try {
        let flatQuestions: Item[] = [];

        // Flatten the questions into a single array and include tableName
        subCategories.forEach((category: TopCategoryItem) => {
          if (category.questions) {
            category.questions.forEach((question, index) => {
              if (question && question.question && question.title) {
                flatQuestions.push({ ...question, tableName: category.title, id: index });
              } else {
                console.error("Invalid question format", question);
              }
            });
          } else {
            console.error("Category without questions", category);
          }
        });

        const normalizedSearch = search.toLowerCase();

        // Filter results based on the search term similarity to the question and title
        const filteredResults = flatQuestions.filter((item: Item) => {
          return (
            item.question.toLowerCase().includes(normalizedSearch) ||
            item.title.toLowerCase().includes(normalizedSearch)
          );
        });

        setSearchResults(filteredResults);
      } catch (error) {
        console.error("Error processing subcategories:", error);
        setFetchError("Error processing subcategories");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [subCategories, search]); // Add 'search' as a dependency

  return {
    searchResults,
    fetchError,
    isLoading,
    isFetching,
  };
};

export default useSearchItems;
