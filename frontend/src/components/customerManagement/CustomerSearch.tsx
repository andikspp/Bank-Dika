import React from 'react';
import { PLACEHOLDERS } from '../../constants/messages';

interface CustomerSearchProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    totalCustomers: number;
    filteredCount: number;
    isLoading: boolean;
}

const CustomerSearch: React.FC<CustomerSearchProps> = ({
    searchTerm,
    onSearchChange,
    totalCustomers,
    filteredCount,
    isLoading
}) => (
    <div className="search-section">
        <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
                type="text"
                placeholder={PLACEHOLDERS.SEARCH}
                className="search-input"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
            />
        </div>
        <div className="results-info">
            {!isLoading && (
                <span>
                    Menampilkan {filteredCount} dari {totalCustomers} nasabah
                </span>
            )}
        </div>
    </div>
);

export default CustomerSearch;