package com.lugardedescanso.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "hosts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Host {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(nullable = false, unique = true)
    private String phoneNumber;

    // Relación con productos
    @OneToMany(mappedBy = "host")
    @JsonIgnore
    private List<Product> products = new ArrayList<>();
}
