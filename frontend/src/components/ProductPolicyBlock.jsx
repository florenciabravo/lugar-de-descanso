import React from 'react'
import '../styles/ProductPolicyBlock.css';

export const ProductPolicyBlock = ({ policies }) => {
    if (!policies || policies.length === 0) return null;

    return (
        <section className="product-policy-block">
            <h2 className="policy-title">Políticas Del Alojamiento</h2>
            <div className="policy-columns">
                {policies.map((policy) => (
                    <div key={policy.id} className="policy-item">
                        <h3 className="policy-item-title">{policy.title}</h3>
                        <p className="policy-item-description">{policy.description}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}
