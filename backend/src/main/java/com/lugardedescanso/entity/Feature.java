package com.lugardedescanso.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "features")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Feature {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String iconUrl;
}
