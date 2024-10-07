import { useState, useEffect } from "react";
import useGetCategories from "components/useGetCategories";
import { ERROR_LOADING_DATA } from "components/messages";

interface Item {
  id: number;
  title: string;
  answer?: string;
  answer_sistani?: string;
  answer_khamenei?: string;
  question: string;
  tableName: string;
}

const useSearchItems = (search: string) => {
  const [searchResults, setSearchResults] = useState<Item[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { subCategories, isFetchingSub } = useGetCategories();

  useEffect(() => {
    const fetchData = async () => {
      if (!subCategories) {
        setFetchError(ERROR_LOADING_DATA);
        setIsLoading(false);
        return;
      }

      try {
        let flatQuestions: Item[] = [];

        // Flatten the questions into a single array and include tableName
        subCategories.forEach((category: any) => {
          category.questions.forEach((question: any, index: any) => {
            if (question && question.question && question.title) {
              flatQuestions.push({
                ...question,
                tableName: category.tableName, // Ensure tableName is added here
                id: `${category.tableName}-${index}`, // Ensure unique id
              });
            } else {
              console.error("Invalid question format", question);
            }
          });
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
        setFetchError(ERROR_LOADING_DATA);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [subCategories, search]);
  return {
    searchResults,
    fetchError,
    isLoading,
    isFetchingSub,
  };
};

export default useSearchItems;
