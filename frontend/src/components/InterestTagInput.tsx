import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './InterestTagInput.css';

interface InterestTag {
    id: string;
    name: string;
}

import { useAuthContext } from '../contexts/AuthContext';

interface InterestTagInputProps {
    selectedTags: string[];
    onChange: (tags: string[]) => void;
    maxTags?: number;
    minTags?: number;
}

const InterestTagInput: React.FC<InterestTagInputProps> = ({
    selectedTags,
    onChange,
    maxTags = 10,
    minTags = 3
}) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<InterestTag[]>([]);
    const [popularTags, setPopularTags] = useState<InterestTag[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const { token } = useAuthContext();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        // Fetch popular tags on mount
        const fetchPopularTags = async () => {
            try {
                const response = await axios.get('/api/interest-tags');
                if (response.data.data?.tags) {
                    setPopularTags(response.data.data.tags.slice(0, 10));
                }
            } catch (error) {
                console.error('Error fetching popular tags:', error);
            }
        };
        fetchPopularTags();

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (query.length > 0) {
            const fetchSuggestions = async () => {
                try {
                    const response = await axios.get(`/api/interest-tags/search?q=${query}`);
                    setSuggestions(response.data.data.tags);
                    setShowSuggestions(true);

                    // Check if query is 2 words and exactly matches something or is unique
                    const words = query.trim().split(/\s+/);
                    const exactMatch = response.data.data.tags.find((t: InterestTag) => t.name.toLowerCase() === query.toLowerCase());
                    setIsAddingNew(words.length <= 2 && !exactMatch && query.length > 2);
                } catch (error) {
                    console.error('Error fetching tags:', error);
                }
            };
            const debounce = setTimeout(fetchSuggestions, 300);
            return () => clearTimeout(debounce);
        } else {
            setSuggestions(popularTags);
            // Don't auto-hide if we clicked into it
            setIsAddingNew(false);
        }
    }, [query, popularTags]);

    const addTag = (tagName: string) => {
        const currentTags = Array.isArray(selectedTags) ? selectedTags : [];
        if (currentTags.length < maxTags && !currentTags.includes(tagName)) {
            onChange([...currentTags, tagName]);
            setQuery('');
            setShowSuggestions(false);
        }
    };

    const removeTag = (tagName: string) => {
        const currentTags = Array.isArray(selectedTags) ? selectedTags : [];
        onChange(currentTags.filter(t => t !== tagName));
    };

    const handleAddNew = async () => {
        const trimmedQuery = query.trim();
        const words = trimmedQuery.split(/\s+/);
        if (words.length > 2) return;

        try {
            const response = await axios.post('/api/interest-tags',
                { name: trimmedQuery },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            addTag(response.data.data.tag.name);
        } catch (error) {
            console.error('Error creating tag:', error);
        }
    };

    return (
        <div className="interest-tag-input-wrapper" ref={wrapperRef}>
            <div className="selected-tags-container">
                {(Array.isArray(selectedTags) ? selectedTags : []).map((tag, idx) => (
                    <span key={`${tag}-${idx}`} className="tag-chip">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="remove-tag">×</button>
                    </span>
                ))}
            </div>

            <div className="input-with-suggestions">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => {
                        if (query.length === 0) setSuggestions(popularTags);
                        setShowSuggestions(true);
                    }}
                    placeholder={selectedTags.length < maxTags ? "Typing something you love..." : `Max ${maxTags} tags reached`}
                    disabled={selectedTags.length >= maxTags}
                    className="tag-text-input"
                    ref={inputRef}
                />

                {showSuggestions && (
                    <div className="suggestions-dropdown">
                        {(Array.isArray(suggestions) ? suggestions : []).map(tag => (
                            <div
                                key={tag.id}
                                className="suggestion-item"
                                onClick={() => addTag(tag.name)}
                            >
                                {tag.name}
                            </div>
                        ))}

                        {isAddingNew && (
                            <div
                                className="suggestion-item add-new-tag"
                                onClick={handleAddNew}
                            >
                                Add new tag: "<strong>{query}</strong>"
                            </div>
                        )}

                        {!isAddingNew && suggestions.length === 0 && query.length > 0 && (
                            <div className="suggestion-item no-match">
                                {query.trim().split(/\s+/).length > 2
                                    ? "Tags must be 1 or 2 words"
                                    : "No matches found"}
                            </div>
                        )}
                    </div>
                )}
            </div>
            <p className="tag-count-hint">
                {(Array.isArray(selectedTags) ? selectedTags.length : 0) < minTags
                    ? `Add at least ${minTags - (Array.isArray(selectedTags) ? selectedTags.length : 0)} more interests`
                    : `${Array.isArray(selectedTags) ? selectedTags.length : 0}/${maxTags} interests added`}
            </p>
        </div >
    );
};

export default InterestTagInput;
